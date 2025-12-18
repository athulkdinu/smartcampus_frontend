import { useState } from 'react'
import toast from 'react-hot-toast'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { Calendar, Users, Send } from 'lucide-react'

const HRInterviews = () => {
  const [pipeline, setPipeline] = useState([])
  const [form, setForm] = useState({
    candidate: '',
    jobTitle: '',
    type: 'Technical',
    date: '',
    panel: ''
  })

  const handleSchedule = (e) => {
    e.preventDefault()
    if (!form.candidate || !form.jobTitle || !form.date) {
      toast.error('Fill candidate, job, and date')
      return
    }
    setPipeline(prev => [
      {
        ...form,
        panel: form.panel.split(',').map(item => item.trim()).filter(Boolean),
        status: 'Awaiting'
      },
      ...prev
    ])
    toast.success('Interview scheduled')
    setForm({ candidate: '', jobTitle: '', type: 'Technical', date: '', panel: '' })
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Interview workflow</p>
            <h1 className="text-3xl font-bold text-slate-900">Schedule & track rounds</h1>
            <p className="text-slate-600">Assign panelists, confirm timings, and keep students informed.</p>
          </div>
          <Button variant="primary">
            <Calendar className="w-4 h-4 mr-2" />
            Sync to calendar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Upcoming interviews</h2>
            <div className="space-y-4">
              {pipeline.map((item, idx) => (
                <div key={`${item.candidate}-${idx}`} className="p-5 rounded-2xl border border-slate-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{item.type}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{item.candidate}</h3>
                      <p className="text-sm text-slate-500">{item.jobTitle}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Confirmed'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{item.date}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="w-3 h-3" />
                    Panel: {item.panel.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Schedule new round</h2>
            <form onSubmit={handleSchedule} className="space-y-4">
              <FormInput
                label="Candidate name"
                value={form.candidate}
                onChange={(e) => setForm(prev => ({ ...prev, candidate: e.target.value }))}
              />
              <FormInput
                label="Job title"
                value={form.jobTitle}
                onChange={(e) => setForm(prev => ({ ...prev, jobTitle: e.target.value }))}
              />
              <FormInput
                label="Round type"
                value={form.type}
                onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                placeholder="Technical / HR"
              />
              <FormInput
                label="Date & time"
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
              />
              <FormInput
                label="Panel (comma separated)"
                value={form.panel}
                onChange={(e) => setForm(prev => ({ ...prev, panel: e.target.value }))}
                placeholder="Priya Singh, Ravi Narayan"
              />
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </HRLayout>
  )
}

export default HRInterviews

