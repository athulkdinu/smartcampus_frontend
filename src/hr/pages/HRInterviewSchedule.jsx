import { useEffect, useMemo, useState } from 'react'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { CalendarCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchAllApplicationsForHrAPI,
  fetchHrInterviewsAPI,
  scheduleInterviewAPI
} from '../../services/placementAPI'

const HRInterviewSchedule = () => {
  const [interviews, setInterviews] = useState([])
  const [applications, setApplications] = useState([])
  const [form, setForm] = useState({
    applicationId: '',
    mode: 'Online',
    date: '',
    time: '',
    round: 'Technical',
    interviewer: ''
  })

  const applicationOptions = useMemo(
    () =>
      applications.map(app => ({
        id: app._id,
        label: `${app.student?.name || 'Candidate'} – ${app.job?.title || ''}`
      })),
    [applications]
  )

  const loadData = async () => {
    const [appsRes, interviewsRes] = await Promise.all([
      fetchAllApplicationsForHrAPI(),
      fetchHrInterviewsAPI()
    ])
    if (appsRes?.status === 200) {
      setApplications(appsRes.data.applications || [])
      setForm(prev => ({
        ...prev,
        applicationId: appsRes.data.applications?.[0]?._id || ''
      }))
    } else {
      toast.error(appsRes?.response?.data?.message || 'Unable to load applications')
    }
    if (interviewsRes?.status === 200) {
      setInterviews(interviewsRes.data.interviews || [])
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSchedule = async (e) => {
    e.preventDefault()
    if (!form.applicationId || !form.date || !form.time) {
      toast.error('Pick application, date and time')
      return
    }
    const res = await scheduleInterviewAPI(form.applicationId, {
      date: form.date,
      time: form.time,
      mode: form.mode,
      roundType: form.round,
      interviewer: form.interviewer
    })
    if (res?.status === 201) {
      toast.success('Interview scheduled')
      setInterviews(prev => [res.data.interview, ...prev])
      setForm(prev => ({ ...prev, date: '', time: '', interviewer: '' }))
    } else {
      toast.error(res?.response?.data?.message || 'Unable to schedule interview')
    }
  }

  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '')
  const formatTime = (value) => (value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white p-6 border border-white/10">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Interviews</p>
          <h1 className="text-3xl font-bold mt-1">Schedule and track interview rounds</h1>
          <p className="text-slate-300 mt-2">Slots published here appear in the student placement timeline instantly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border border-slate-100/10 bg-white/85 backdrop-blur">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Schedule interview</h2>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Application</label>
                <select
                  value={form.applicationId}
                  onChange={(e) => handleChange('applicationId', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  {applicationOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Mode</label>
                  <select value={form.mode} onChange={(e) => handleChange('mode', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                    {['Online', 'Offline', 'Hybrid'].map(mode => <option key={mode}>{mode}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Round Type</label>
                  <select value={form.round} onChange={(e) => handleChange('round', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                    {['Technical', 'Managerial', 'HR'].map(round => <option key={round}>{round}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Date" type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} required />
                <FormInput label="Time" type="time" value={form.time} onChange={(e) => handleChange('time', e.target.value)} required />
              </div>
              <FormInput label="Interviewer" value={form.interviewer} onChange={(e) => handleChange('interviewer', e.target.value)} placeholder="Panel member" />
              <Button type="submit" variant="primary" className="w-full flex items-center justify-center gap-2">
                <CalendarCheck className="w-4 h-4" />
                Schedule
              </Button>
            </form>
          </Card>

          <Card className="lg:col-span-2 border border-slate-100/10 bg-white/85 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Upcoming interviews</h2>
                <p className="text-sm text-slate-500">{interviews.length} rounds planned</p>
              </div>
              <Button size="sm" variant="secondary" onClick={loadData}>Refresh</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviews.map(interview => (
                <div key={interview._id} className="p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{interview.student?.name}</p>
                      <p className="text-xs text-slate-500">{interview.job?.title}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">{interview.roundType}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{interview.mode} · {interview.interviewer || 'TBD'}</p>
                  <p className="text-sm text-slate-700 mt-1">{formatDate(interview.scheduledAt)} · {formatTime(interview.scheduledAt)}</p>
                </div>
              ))}
            </div>
            {interviews.length === 0 && <p className="text-center text-slate-500 py-12">No interviews scheduled.</p>}
          </Card>
        </div>
      </div>
    </HRLayout>
  )
}

export default HRInterviewSchedule

