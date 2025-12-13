import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import Modal from '../../shared/components/Modal'
import { FilePlus, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { createJobAPI, fetchJobsAPI } from '../../services/placementAPI'

const defaultForm = {
  title: '',
  company: 'SmartCampus Partner',
  jobType: 'Full-time',
  mode: 'Hybrid',
  location: '',
  salary: '',
  openings: '',
  eligibility: {
    departments: [],
    cgpa: '',
    skills: []
  },
  description: '',
  responsibilities: [],
  deadline: '',
  status: 'Active'
}

const HRCreateJob = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(defaultForm)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeJobsCount, setActiveJobsCount] = useState(0)
  const [loadingCount, setLoadingCount] = useState(true)

  useEffect(() => {
    loadActiveJobsCount()
  }, [])

  const loadActiveJobsCount = async () => {
    try {
      setLoadingCount(true)
      const res = await fetchJobsAPI({ mine: true })
      if (res?.status === 200) {
        const activeJobs = (res.data.jobs || []).filter(job => job.status === 'Active')
        setActiveJobsCount(activeJobs.length)
      }
    } catch (error) {
      console.error('Error loading jobs count:', error)
    } finally {
      setLoadingCount(false)
    }
  }

  const handleChange = (key, value) => {
    if (key === 'eligibilityDept') {
      setForm(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          departments: value.split(',').map(item => item.trim()).filter(Boolean)
        }
      }))
    } else if (key === 'eligibilityCgpa') {
      setForm(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          cgpa: value
        }
      }))
    } else if (key === 'eligibilitySkills') {
      setForm(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          skills: value.split(',').map(item => item.trim()).filter(Boolean)
        }
      }))
    } else if (key === 'responsibilities') {
      setForm(prev => ({
        ...prev,
        responsibilities: value.split('\n').filter(Boolean)
      }))
    } else {
      setForm(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.deadline) {
      toast.error('Title and deadline are required')
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        title: form.title.trim(),
        company: form.company.trim(),
        jobType: form.jobType,
        mode: form.mode,
        location: form.location || '',
        salary: form.salary || '',
        openings: form.openings ? parseInt(form.openings) : undefined,
        eligibility: form.eligibility,
        description: form.description || '',
        responsibilities: form.responsibilities,
        deadline: form.deadline,
        status: form.status || 'Active'
      }

      const res = await createJobAPI(payload)
      if (res?.status === 201) {
        toast.success('Job created successfully')
        setForm(defaultForm)
        // Refresh active jobs count
        await loadActiveJobsCount()
        // Navigate to manage jobs to see the new job
        navigate('/hr/manage-jobs')
      } else {
        const message = res?.response?.data?.message || 'Failed to create job'
        toast.error(message)
      }
    } catch (error) {
      console.error('Error creating job:', error)
      const message = error?.response?.data?.message || 'Something went wrong'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
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
              <span className="font-semibold text-white">{loadingCount ? '...' : activeJobsCount}</span> jobs active
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2 border border-slate-100/10 bg-white/85 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput 
                  label="Job Title" 
                  value={form.title} 
                  onChange={(e) => handleChange('title', e.target.value)} 
                  placeholder="Software Intern" 
                  required 
                />
                <FormInput 
                  label="Company Name" 
                  value={form.company} 
                  onChange={(e) => handleChange('company', e.target.value)} 
                />
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Job Type</label>
                  <select 
                    value={form.jobType} 
                    onChange={(e) => handleChange('jobType', e.target.value)} 
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Mode</label>
                  <select 
                    value={form.mode} 
                    onChange={(e) => handleChange('mode', e.target.value)} 
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <FormInput 
                  label="Location" 
                  value={form.location} 
                  onChange={(e) => handleChange('location', e.target.value)} 
                  placeholder="City, State" 
                />
                <FormInput 
                  label="Salary / Stipend" 
                  value={form.salary} 
                  onChange={(e) => handleChange('salary', e.target.value)} 
                  placeholder="₹35,000 / month" 
                />
                <FormInput 
                  label="Number of Openings" 
                  type="number"
                  value={form.openings} 
                  onChange={(e) => handleChange('openings', e.target.value)} 
                  placeholder="5" 
                />
                <FormInput 
                  label="Last Date to Apply" 
                  type="date" 
                  value={form.deadline} 
                  onChange={(e) => handleChange('deadline', e.target.value)} 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput 
                  label="Eligible Departments (comma separated)" 
                  value={form.eligibility.departments.join(', ')} 
                  onChange={(e) => handleChange('eligibilityDept', e.target.value)} 
                  placeholder="CSE, IT, ECE" 
                />
                <FormInput 
                  label="Min CGPA" 
                  value={form.eligibility.cgpa} 
                  onChange={(e) => handleChange('eligibilityCgpa', e.target.value)} 
                  placeholder="7.0" 
                />
                <FormInput 
                  label="Skills (comma separated)" 
                  value={form.eligibility.skills.join(', ')} 
                  onChange={(e) => handleChange('eligibilitySkills', e.target.value)} 
                  placeholder="React, Node.js, MongoDB" 
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Role Description</label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => handleChange('description', e.target.value)} 
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" 
                  rows={4} 
                  placeholder="Share what the team does, tech stack, expected outcomes." 
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Responsibilities (one per line)</label>
                <textarea 
                  value={form.responsibilities.join('\n')} 
                  onChange={(e) => handleChange('responsibilities', e.target.value)} 
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" 
                  rows={3} 
                  placeholder="- Build dashboards&#10;- Present weekly demos" 
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="primary" className="flex items-center gap-2" disabled={submitting}>
                  <FilePlus className="w-4 h-4" />
                  {submitting ? 'Creating...' : 'Publish Job'}
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
            <p>{form.jobType} · {form.mode} · {form.location || 'Location TBD'}</p>
            <p className="text-emerald-600 font-semibold mt-1">{form.salary || 'Compensation TBD'}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Eligibility</p>
            <ul className="list-disc list-inside text-slate-600 text-sm mt-1">
              <li>Departments: {form.eligibility.departments.length > 0 ? form.eligibility.departments.join(', ') : 'All'}</li>
              <li>CGPA: {form.eligibility.cgpa || '7.0+'}</li>
              <li>Skills: {form.eligibility.skills.length > 0 ? form.eligibility.skills.join(', ') : 'To be specified'}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Description</p>
            <p>{form.description || 'Add description to highlight role impact.'}</p>
          </div>
          {form.responsibilities.length > 0 && (
            <div>
              <p className="font-semibold text-slate-900">Responsibilities</p>
              <ul className="list-disc list-inside text-slate-600 text-sm mt-1">
                {form.responsibilities.map((item, idx) => <li key={idx}>{item}</li>)}
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
