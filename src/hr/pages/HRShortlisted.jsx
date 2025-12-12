import { useEffect, useMemo, useState } from 'react'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Calendar, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchAllApplicationsForHrAPI,
  updateApplicationStatusAPI
} from '../../services/placementAPI'

const HRShortlisted = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const shortlisted = useMemo(
    () => applications.filter(app => app.status === 'Shortlisted'),
    [applications]
  )

  const grouped = useMemo(() => {
    return shortlisted.reduce((acc, candidate) => {
      const jobTitle = candidate.job?.title || 'Job'
      acc[jobTitle] = acc[jobTitle] || []
      acc[jobTitle].push(candidate)
      return acc
    }, {})
  }, [shortlisted])

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
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Shortlisted</p>
          <h1 className="text-3xl font-bold mt-1">Candidates ready for interviews</h1>
          <p className="text-slate-300 mt-2">
            Move shortlisted students into interview rounds or reject with a single click.
          </p>
        </div>

        <Button size="sm" variant="secondary" onClick={loadApplications}>
          Refresh
        </Button>

        {loading && <Card className="p-4 text-sm text-slate-500">Loading...</Card>}

        {!loading && Object.entries(grouped).map(([jobTitle, candidates]) => (
          <Card key={jobTitle} className="border border-slate-100/10 bg-white/85 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Job</p>
                <h2 className="text-xl font-bold text-slate-900">{jobTitle}</h2>
              </div>
              <span className="text-sm text-slate-500">{candidates.length} shortlisted</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map(candidate => (
                <div key={candidate._id} className="p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{candidate.student?.name}</p>
                      <p className="text-xs text-slate-500">
                        {candidate.student?.department || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateStatus(candidate._id, 'Interview Scheduled')}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Mark as Scheduled
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateStatus(candidate._id, 'Rejected')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {!loading && shortlisted.length === 0 && (
          <Card className="text-center py-12 text-slate-500">
            No shortlisted candidates yet.
          </Card>
        )}
      </div>
    </HRLayout>
  )
}

export default HRShortlisted

