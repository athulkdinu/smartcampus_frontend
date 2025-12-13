import { useEffect, useState, useMemo } from 'react'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { FileText, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchAllApplicationsForHrAPI, fetchJobsAPI } from '../../services/placementAPI'

const statusBadge = (status) => {
  switch (status) {
    case 'Shortlisted':
      return 'bg-emerald-50 text-emerald-700'
    case 'Interview Scheduled':
      return 'bg-indigo-50 text-indigo-700'
    case 'Offered':
      return 'bg-purple-50 text-purple-700'
    case 'Rejected':
      return 'bg-rose-50 text-rose-600'
    default:
      return 'bg-amber-50 text-amber-700'
  }
}

const HRApplications = () => {
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [applicationsRes, jobsRes] = await Promise.all([
        fetchAllApplicationsForHrAPI(),
        fetchJobsAPI({ mine: true })
      ])

      if (applicationsRes?.status === 200) {
        setApplications(applicationsRes.data.applications || [])
      } else {
        setApplications([])
        toast.error('Failed to load applications')
      }

      if (jobsRes?.status === 200) {
        setJobs(jobsRes.data.jobs || [])
      } else {
        setJobs([])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setApplications([])
      setJobs([])
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const jobsMap = useMemo(() => {
    return Object.fromEntries(jobs.map(job => [job._id, job.title]))
  }, [jobs])

  const applicationStatuses = useMemo(() => {
    const statuses = new Set(applications.map(app => app.status))
    return Array.from(statuses).filter(Boolean)
  }, [applications])

  const filteredApplications = useMemo(() => {
    if (filter === 'All') return applications
    return applications.filter(app => app.status === filter)
  }, [applications, filter])

  if (loading) {
    return (
      <HRLayout>
        <Card>
          <div className="text-center py-8 text-slate-500">Loading applications...</div>
        </Card>
      </HRLayout>
    )
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Applications</p>
            <h1 className="text-3xl font-bold text-slate-900">Review pipeline</h1>
            <p className="text-slate-600">Track every student application across roles and statuses.</p>
          </div>
          <Button variant="primary">
            <FileText className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Filter className="w-4 h-4" />
              Filter by status
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', ...applicationStatuses].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                    filter === status
                      ? 'border-purple-500 text-purple-700 bg-purple-50'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {filter === 'All' ? 'No applications received yet.' : `No applications with status "${filter}".`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-3">Applicant</th>
                    <th className="py-3">Job</th>
                    <th className="py-3">Submitted</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map(app => (
                    <tr key={app._id} className="border-b border-slate-100">
                      <td className="py-3">
                        <div className="font-semibold text-slate-900">
                          {app.student?.name || 'Unknown Student'}
                        </div>
                        <p className="text-xs text-slate-500">
                          {app.student?.email || app.student?.studentID || app._id}
                        </p>
                      </td>
                      <td className="py-3">
                        <p className="text-slate-900">{jobsMap[app.job] || 'Unknown Job'}</p>
                        <p className="text-xs text-slate-400">{app.job}</p>
                      </td>
                      <td className="py-3">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(app.status)}`}>
                          {app.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </HRLayout>
  )
}

export default HRApplications
