import { useMemo, useState } from 'react'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import { hrApplications, hrJobOpenings, applicationStatuses } from '../data/hrDemoData'
import { Eye, CheckCircle2, XCircle, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const HRViewApplications = () => {
  const [applications, setApplications] = useState(hrApplications)
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedProfile, setSelectedProfile] = useState(null)
  const jobMap = useMemo(() => Object.fromEntries(hrJobOpenings.map(job => [job.id, job.title])), [])

  const filteredApplications = applications.filter(app => statusFilter === 'All' || app.status === statusFilter)

  const updateStatus = (id, status) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app))
    toast.success(`Application ${status}`)
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white p-6 border border-white/10">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Applications</p>
          <h1 className="text-3xl font-bold mt-1">Student applications feed</h1>
          <p className="text-slate-300 mt-2">Status changes here update Placement → Application Status for every student.</p>
        </div>

        <Card className="border border-slate-100/10 bg-white/85 backdrop-blur">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              {['All', ...applicationStatuses].map(status => (
                <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${statusFilter === status ? 'border-indigo-500 text-indigo-600 bg-indigo-50' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-3">Student</th>
                  <th className="py-3">Course / Dept</th>
                  <th className="py-3">Job</th>
                  <th className="py-3">Skills</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(app => (
                  <tr key={app.id} className="border-b border-slate-100">
                    <td className="py-3">
                      <p className="font-semibold text-slate-900">{app.studentName}</p>
                      <p className="text-xs text-slate-500">{app.id}</p>
                    </td>
                    <td className="py-3">{app.course} · {app.department}</td>
                    <td className="py-3">
                      <p className="text-slate-900">{jobMap[app.jobId]}</p>
                    </td>
                    <td className="py-3 text-slate-500">{app.skills.join(', ')}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                        app.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-700' :
                        app.status === 'Interview Scheduled' ? 'bg-indigo-50 text-indigo-700' :
                        app.status === 'Offered' ? 'bg-purple-50 text-purple-700' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-indigo-50" title="View Profile" onClick={() => setSelectedProfile(app)}>
                          <Eye className="w-4 h-4 text-indigo-500" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-emerald-50" title="Shortlist" onClick={() => updateStatus(app.id, 'Shortlisted')}>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-blue-50" title="Schedule Interview" onClick={() => updateStatus(app.id, 'Interview Scheduled')}>
                          <Calendar className="w-4 h-4 text-blue-500" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-rose-50" title="Reject" onClick={() => updateStatus(app.id, 'Rejected')}>
                          <XCircle className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredApplications.length === 0 && (
              <div className="text-center py-12 text-slate-500">No applications under this filter.</div>
            )}
          </div>
        </Card>
      </div>

      <Modal isOpen={!!selectedProfile} onClose={() => setSelectedProfile(null)} title="Candidate Profile" size="lg">
        {selectedProfile && (
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">{selectedProfile.department}</p>
              <h3 className="text-2xl font-bold text-slate-900">{selectedProfile.studentName}</h3>
              <p>GPA {selectedProfile.gpa} · {selectedProfile.experience}</p>
              <a href={selectedProfile.resume} className="text-indigo-600 text-xs" target="_blank" rel="noreferrer">View resume</a>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Skills</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedProfile.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Certifications</p>
              <p>{selectedProfile.certifications.join(', ') || '—'}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Projects</p>
              <ul className="list-disc list-inside">
                {selectedProfile.projects.map(project => (
                  <li key={project}>{project}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </HRLayout>
  )
}

export default HRViewApplications

