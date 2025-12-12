import { useEffect, useMemo, useState } from 'react'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import { Eye, CheckCircle2, XCircle, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchAllApplicationsForHrAPI,
  updateApplicationStatusAPI
} from '../../services/placementAPI'

const applicationStatuses = ['Pending', 'Shortlisted', 'Interview Scheduled', 'Offered', 'Rejected']

const HRViewApplications = () => {
  const [applications, setApplications] = useState([])
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const jobMap = useMemo(
    () => Object.fromEntries(applications.map(app => [app.job?._id, app.job?.title])),
    [applications]
  )

  const loadApplications = async () => {
    setLoading(true)
    const res = await fetchAllApplicationsForHrAPI()
    if (res?.status === 200) {
      setApplications(res.data.applications || [])
    } else {
      toast.error(res?.response?.data?.message || 'Unable to load applications')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const filteredApplications = applications.filter(app => statusFilter === 'All' || app.status === statusFilter)

  const updateStatus = async (id, status) => {
    const res = await updateApplicationStatusAPI(id, status)
    if (res?.status === 200) {
      toast.success(`Application ${status}`)
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app))
    } else {
      toast.error(res?.response?.data?.message || 'Unable to update status')
    }
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
            <Button size="sm" variant="secondary" onClick={loadApplications}>
              Refresh
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-3">Student</th>
                  <th className="py-3">Department</th>
                  <th className="py-3">Job</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      Loading applications...
                    </td>
                  </tr>
                )}
                {!loading && filteredApplications.map(app => (
                  <tr key={app._id} className="border-b border-slate-100">
                    <td className="py-3">
                      <p className="font-semibold text-slate-900">{app.student?.name}</p>
                      <p className="text-xs text-slate-500">{app.student?.email}</p>
                    </td>
                    <td className="py-3">{app.student?.department || '—'}</td>
                    <td className="py-3">
                      <p className="text-slate-900">{jobMap[app.job?._id]}</p>
                    </td>
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
                        <button className="p-1.5 rounded-lg hover:bg-emerald-50" title="Shortlist" onClick={() => updateStatus(app._id, 'Shortlisted')}>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-blue-50" title="Schedule Interview" onClick={() => updateStatus(app._id, 'Interview Scheduled')}>
                          <Calendar className="w-4 h-4 text-blue-500" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-rose-50" title="Reject" onClick={() => updateStatus(app._id, 'Rejected')}>
                          <XCircle className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && filteredApplications.length === 0 && (
              <div className="text-center py-12 text-slate-500">No applications under this filter.</div>
            )}
          </div>
        </Card>
      </div>

      <Modal isOpen={!!selectedProfile} onClose={() => setSelectedProfile(null)} title="Candidate Profile" size="lg">
        {selectedProfile && (
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">{selectedProfile.student?.department}</p>
              <h3 className="text-2xl font-bold text-slate-900">{selectedProfile.student?.name}</h3>
              <p>{selectedProfile.student?.email}</p>
              {selectedProfile.resumeUrl && (
                <a href={selectedProfile.resumeUrl} className="text-indigo-600 text-xs" target="_blank" rel="noreferrer">View resume</a>
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-900">Status</p>
              <p>{selectedProfile.status}</p>
            </div>
          </div>
        )}
      </Modal>
    </HRLayout>
  )
}

export default HRViewApplications

