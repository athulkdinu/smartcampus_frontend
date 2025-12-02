import { useMemo, useState } from 'react'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import Modal from '../../shared/components/Modal'
import { hrJobOpenings } from '../data/hrDemoData'
import { FilePlus, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const defaultForm = {
  title: '',
  company: 'SmartCampus Partner',
  jobType: 'Internship',
  location: 'Hybrid',
  salary: '',
  eligibilityDept: 'CSE, IT',
  eligibilityCgpa: '7.0+',
  eligibilitySkills: '',
  description: '',
  responsibilities: '',
  deadline: '',
  status: 'Draft'
}

const HRCreateJob = () => {
  const [jobs, setJobs] = useState(hrJobOpenings)
  const [form, setForm] = useState(defaultForm)
  const [previewOpen, setPreviewOpen] = useState(false)

  const activeCount = useMemo(() => jobs.filter(job => job.status === 'Active').length, [jobs])

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.deadline) {
      toast.error('Add the job title and deadline')
      return
    }
    const newJob = {
      id: `JOB-${Math.floor(Math.random() * 900 + 300)}`,
      title: form.title,
      company: form.company,
      jobType: form.jobType,
      location: form.location,
      salary: form.salary,
      eligibility: {
        departments: form.eligibilityDept.split(',').map(item => item.trim()),
        cgpa: form.eligibilityCgpa,
        skills: form.eligibilitySkills.split(',').map(item => item.trim()).filter(Boolean)
      },
      description: form.description,
      responsibilities: form.responsibilities.split('\n').filter(Boolean),
      deadline: form.deadline,
      status: form.status,
      applications: 0,
      lastUpdated: 'Just now'
    }
    setJobs(prev => [newJob, ...prev])
    toast.success(`${form.title} published to students`)
    setForm(defaultForm)
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white p-6 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Create Job</p>
              <h1 className="text-3xl font-bold mt-1">Publish new opportunity</h1>
              <p className="text-slate-300 mt-2">Students will see published jobs instantly inside Placement → Job Listings.</p>
            </div>
            <div className="text-sm text-slate-200">
              <span className="font-semibold text-white">{activeCount}</span> jobs active
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2 border border-slate-100/10 bg-white/85 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Job Title" value={form.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Software Intern" required />
                <FormInput label="Company Name" value={form.company} onChange={(e) => handleChange('company', e.target.value)} />
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Job Type</label>
                  <select value={form.jobType} onChange={(e) => handleChange('jobType', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                    {['Internship', 'Full-time', 'Apprenticeship'].map(type => <option key={type}>{type}</option>)}
                  </select>
                </div>
                <FormInput label="Location" value={form.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="Remote / Hybrid / On-site" />
                <FormInput label="Salary / Stipend" value={form.salary} onChange={(e) => handleChange('salary', e.target.value)} placeholder="₹35,000 / month" />
                <FormInput label="Last Date to Apply" type="date" value={form.deadline} onChange={(e) => handleChange('deadline', e.target.value)} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="Eligible Departments" value={form.eligibilityDept} onChange={(e) => handleChange('eligibilityDept', e.target.value)} />
                <FormInput label="Min CGPA" value={form.eligibilityCgpa} onChange={(e) => handleChange('eligibilityCgpa', e.target.value)} />
                <FormInput label="Skills (comma separated)" value={form.eligibilitySkills} onChange={(e) => handleChange('eligibilitySkills', e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Role Description</label>
                <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" rows={4} placeholder="Share what the team does, tech stack, expected outcomes." />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Responsibilities (one per line)</label>
                <textarea value={form.responsibilities} onChange={(e) => handleChange('responsibilities', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" rows={3} placeholder="- Build dashboards&#10;- Present weekly demos" />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="primary" className="flex items-center gap-2">
                  <FilePlus className="w-4 h-4" />
                  Publish Job
                </Button>
                <Button type="button" variant="secondary" onClick={() => setPreviewOpen(true)} className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Job Preview" size="lg">
        <div className="space-y-4 text-sm text-slate-600">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">{form.company}</p>
            <h3 className="text-xl font-bold text-slate-900">{form.title || 'Untitled role'}</h3>
            <p>{form.jobType} · {form.location}</p>
            <p className="text-emerald-600 font-semibold mt-1">{form.salary || 'Compensation TBD'}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Eligibility</p>
            <ul className="list-disc list-inside text-slate-600 text-sm mt-1">
              <li>Departments: {form.eligibilityDept || 'All'}</li>
              <li>CGPA: {form.eligibilityCgpa || '7.0+'}</li>
              <li>Skills: {form.eligibilitySkills || 'To be specified'}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Description</p>
            <p>{form.description || 'Add description to highlight role impact.'}</p>
          </div>
          {form.responsibilities && (
            <div>
              <p className="font-semibold text-slate-900">Responsibilities</p>
              <ul className="list-disc list-inside text-slate-600 text-sm mt-1">
                {form.responsibilities.split('\n').filter(Boolean).map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}
          <p className="text-xs text-slate-500">Last date to apply: {form.deadline || '—'}</p>
        </div>
      </Modal>
    </HRLayout>
  )
}

export default HRCreateJob

