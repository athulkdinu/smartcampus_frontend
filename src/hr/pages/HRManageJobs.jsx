import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import FormInput from '../../shared/components/FormInput'
import { hrJobOpenings, hrApplications } from '../data/hrDemoData'
import { ClipboardList, Edit, X, Archive, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const HRManageJobs = () => {
  const [jobs, setJobs] = useState(hrJobOpenings)
  const [editingJob, setEditingJob] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const navigate = useNavigate()

  const toggleStatus = (id, status) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, status } : job))
    toast.success(`Job ${status === 'Closed' ? 'closed' : 'reopened'}`)
  }

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(job => job.id !== id))
    toast.success('Job deleted')
  }

  const handleEditSave = (e) => {
    e.preventDefault()
    setJobs(prev => prev.map(job => job.id === editingJob.id ? editingJob : job))
    toast.success('Job updated')
    setEditingJob(null)
  }

  const viewApplicationsForJob = (job) => {
    setSelectedJob(job)
  }

  const shortlistedCountForJob = (jobId) =>
    hrApplications.filter(app => app.jobId === jobId && app.status === 'Shortlisted').length

  const applicationsForSelectedJob = selectedJob
    ? hrApplications.filter(app => app.jobId === selectedJob.id)
    : []

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white p-6 border border-white/10 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Jobs</p>
          <h1 className="text-3xl font-bold">Manage Jobs & Applications</h1>
          <p className="text-slate-300">
            Card-based overview of every posting with quick access to applicants and status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobs.map(job => (
            <Card key={job.id} className="border border-slate-100/10 bg-white/85 backdrop-blur p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{job.id}</p>
                  <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
                  <p className="text-xs text-slate-500">{job.company}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    job.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : job.status === 'Closed'
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <p>{job.location}</p>
                <p>{job.jobType}</p>
                <p>Deadline: {job.deadline}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {job.applications} applications
                  </span>
                  <span>{shortlistedCountForJob(job.id)} shortlisted</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => viewApplicationsForJob(job)}
                >
                  View Applications
                </Button>
                {job.status !== 'Closed' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleStatus(job.id, 'Closed')}
                  >
                    Close Job
                  </Button>
                )}
                {job.status === 'Closed' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleStatus(job.id, 'Active')}
                  >
                    Reopen
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditingJob(job)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-rose-600 hover:text-rose-700"
                  onClick={() => deleteJob(job.id)}
                >
                  <X className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
              <button
                type="button"
                className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 text-left"
                onClick={() => navigate('/hr/applications')}
              >
                Open full applications view
              </button>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!editingJob}
        onClose={() => setEditingJob(null)}
        title="Edit Job Posting"
        size="lg"
      >
        {editingJob && (
          <form onSubmit={handleEditSave} className="space-y-4">
            <FormInput
              label="Job Title"
              value={editingJob.title}
              onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
            />
            <FormInput
              label="Location"
              value={editingJob.location}
              onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
            />
            <FormInput
              label="Salary / CTC"
              value={editingJob.salary}
              onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
            />
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Description</label>
              <textarea
                value={editingJob.description}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, description: e.target.value })
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
              <Button type="button" variant="secondary" onClick={() => setEditingJob(null)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob ? `Applications – ${selectedJob.title}` : 'Applications'}
        size="lg"
      >
        {selectedJob && (
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500">{selectedJob.company}</p>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {applicationsForSelectedJob.length} applications
              </span>
            </div>
            <div className="space-y-3">
              {applicationsForSelectedJob.map(app => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{app.studentName}</p>
                    <p className="text-xs text-slate-500">
                      {app.course} · {app.department}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700'
                        : app.status === 'Shortlisted'
                        ? 'bg-emerald-50 text-emerald-700'
                        : app.status === 'Interview Scheduled'
                        ? 'bg-indigo-50 text-indigo-700'
                        : app.status === 'Offered'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
              {applicationsForSelectedJob.length === 0 && (
                <p className="text-sm text-slate-500">
                  No applications received for this job yet.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </HRLayout>
  )
}

export default HRManageJobs

