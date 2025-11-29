import { useState } from 'react'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { hrInterviewSchedule, hrJobOpenings } from '../data/hrDemoData'
import { CalendarCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const HRInterviewSchedule = () => {
  const [interviews, setInterviews] = useState(hrInterviewSchedule)
  const [form, setForm] = useState({
    candidate: '',
    jobId: hrJobOpenings[0]?.id || '',
    mode: 'Online',
    date: '',
    time: '',
    round: 'Technical',
    interviewer: ''
  })

  const jobOptions = hrJobOpenings.map(job => ({ id: job.id, title: job.title }))

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSchedule = (e) => {
    e.preventDefault()
    if (!form.candidate.trim() || !form.date || !form.time) {
      toast.error('Fill candidate, date and time')
      return
    }
    const jobTitle = jobOptions.find(job => job.id === form.jobId)?.title || form.jobId
    const newInterview = {
      id: `INT-${Math.floor(Math.random() * 900 + 600)}`,
      candidate: form.candidate,
      jobId: form.jobId,
      jobTitle: jobTitle,
      mode: form.mode,
      date: form.date,
      time: form.time,
      round: form.round,
      interviewer: form.interviewer || 'Panel TBD',
      status: 'Scheduled'
    }
    setInterviews(prev => [newInterview, ...prev])
    toast.success('Interview scheduled')
    setForm({ ...form, candidate: '', date: '', time: '', interviewer: '' })
  }

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
              <FormInput label="Candidate Name" value={form.candidate} onChange={(e) => handleChange('candidate', e.target.value)} placeholder="Aditi " required />
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Job Title</label>
                <select value={form.jobId} onChange={(e) => handleChange('jobId', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                  {jobOptions.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviews.map(interview => (
                <div key={interview.id} className="p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{interview.candidate}</p>
                      <p className="text-xs text-slate-500">{interview.jobTitle}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">{interview.round}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{interview.mode} · {interview.interviewer}</p>
                  <p className="text-sm text-slate-700 mt-1">{interview.date} · {interview.time}</p>
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

