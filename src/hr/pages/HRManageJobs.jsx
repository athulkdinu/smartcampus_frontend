import { useState } from 'react'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import FormInput from '../../shared/components/FormInput'
import { hrJobOpenings } from '../data/hrDemoData'
import { ClipboardList, Edit, X, Copy, Archive } from 'lucide-react'
import toast from 'react-hot-toast'

const HRManageJobs = () => {
  const [jobs, setJobs] = useState(hrJobOpenings)
  const [editingJob, setEditingJob] = useState(null)

  const toggleStatus = (id, status) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, status } : job))
    toast.success(`Job ${status === 'Closed' ? 'closed' : 'reopened'}`)
  }

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(job => job.id !== id))
    toast.success('Job deleted')
  }

  const duplicateJob = (job) => {
    const clone = { ...job, id: `JOB-${Math.floor(Math.random() * 900 + 400)}`, status: 'Draft', lastUpdated: 'Just now' }
    setJobs(prev => [clone, ...prev])
    toast.success('Job duplicated as draft')
  }

  const handleEditSave = (e) => {
    e.preventDefault()
    setJobs(prev => prev.map(job => job.id === editingJob.id ? editingJob : job))
    toast.success('Job updated')
    setEditingJob(null)
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white p-6 border border-white/10 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Pipeline</p>
          <h1 className="text-3xl font-bold">Manage Job Postings</h1>
          <p className="text-slate-300">Every change instantly syncs with the student placement job board.</p>
        </div>

        <Card className="border border-slate-100/10 bg-white/85 backdrop-blur">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">All postings</h2>
              <p className="text-sm text-slate-500">{jobs.length} roles published or in draft</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-3">Job Title</th>
                  <th className="py-3">Applications</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Deadline</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4">
                      <p className="font-semibold text-slate-900">{job.title}</p>
                      <p className="text-xs text-slate-500">{job.company}</p>
                    </td>
                    <td className="py-4">{job.applications}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : job.status === 'Closed' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-50 text-indigo-700'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4">{job.deadline}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-indigo-50" title="Edit" onClick={() => setEditingJob(job)}>
                          <Edit className="w-4 h-4 text-indigo-500" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-emerald-50" title="Duplicate" onClick={() => duplicateJob(job)}>
                          <Copy className="w-4 h-4 text-emerald-500" />
                        </button>
                        {job.status !== 'Closed' ? (
                          <button className="p-1.5 rounded-lg hover:bg-rose-50" title="Close Posting" onClick={() => toggleStatus(job.id, 'Closed')}>
                            <Archive className="w-4 h-4 text-rose-500" />
                          </button>
                        ) : (
                          <button className="p-1.5 rounded-lg hover:bg-emerald-50" title="Reopen" onClick={() => toggleStatus(job.id, 'Active')}>
                            <ClipboardList className="w-4 h-4 text-emerald-500" />
                          </button>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-rose-50" title="Delete" onClick={() => deleteJob(job.id)}>
                          <X className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal isOpen={!!editingJob} onClose={() => setEditingJob(null)} title="Edit Job Posting" size="lg">
        {editingJob && (
          <form onSubmit={handleEditSave} className="space-y-4">
            <FormInput label="Job Title" value={editingJob.title} onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })} />
            <FormInput label="Location" value={editingJob.location} onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })} />
            <FormInput label="Salary / CTC" value={editingJob.salary} onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })} />
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Description</label>
              <textarea value={editingJob.description} onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" rows={3} />
            </div>
            <div className="flex gap-3">
              <Button type="submit" variant="primary">Save Changes</Button>
              <Button type="button" variant="secondary" onClick={() => setEditingJob(null)}>Cancel</Button>
            </div>
          </form>
        )}
      </Modal>
    </HRLayout>
  )
}

export default HRManageJobs

