import { useState } from 'react'
import toast from 'react-hot-toast'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { jobPostings as jobSeed, statusOptions } from '../data/hrDemoData'
import { Briefcase, PlusCircle } from 'lucide-react'

const HRJobPostings = () => {
  const [jobs, setJobs] = useState(jobSeed)
  const [form, setForm] = useState({
    title: '',
    company: '',
    mode: 'On-site',
    ctc: '',
    openings: '',
    deadline: '',
    description: '',
    status: 'Draft'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.company) {
      toast.error('Add the job title and company')
      return
    }
    const newJob = {
      id: `JOB-${Math.floor(Math.random() * 900 + 100)}`,
      status: 'Draft',
      ...form
    }
    setJobs(prev => [newJob, ...prev])
    toast.success(`${form.title} saved as draft`)
    setForm({
      title: '',
      company: '',
      mode: 'On-site',
      ctc: '',
      openings: '',
      deadline: '',
      description: '',
      status: 'Draft'
    })
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Job post management</p>
            <h1 className="text-3xl font-bold text-slate-900">Create & share opportunities</h1>
            <p className="text-slate-600">Publish roles for campus drives and keep recruiters updated.</p>
          </div>
          <Button variant="primary">
            <PlusCircle className="w-4 h-4 mr-2" />
            New posting
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Live job board</h2>
              <span className="text-sm text-slate-500">{jobs.length} total roles</span>
            </div>
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="p-5 rounded-2xl border border-slate-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{job.id}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-500">{job.company}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      job.status === 'Active'
                        ? 'bg-green-50 text-green-700'
                        : job.status === 'Screening'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{job.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span>{job.mode}</span>
                    <span>CTC {job.ctc || 'TBD'}</span>
                    <span>{job.openings || '-'} openings</span>
                    <span>Deadline {job.deadline || 'TBD'}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add new role</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Job title"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Backend Engineer"
              />
              <FormInput
                label="Company"
                value={form.company}
                onChange={(e) => setForm(prev => ({ ...prev, company: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Mode"
                  value={form.mode}
                  onChange={(e) => setForm(prev => ({ ...prev, mode: e.target.value }))}
                />
                <FormInput
                  label="Openings"
                  type="number"
                  value={form.openings}
                  onChange={(e) => setForm(prev => ({ ...prev, openings: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="CTC"
                  value={form.ctc}
                  onChange={(e) => setForm(prev => ({ ...prev, ctc: e.target.value }))}
                  placeholder="8 LPA"
                />
                <FormInput
                  label="Deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  rows={3}
                  placeholder="Key responsibilities, stack..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="primary" className="w-full">
                <Briefcase className="w-4 h-4 mr-2" />
                Save job
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </HRLayout>
  )
}

export default HRJobPostings

