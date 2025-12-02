import { useMemo, useState } from 'react'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import FormInput from '../../shared/components/FormInput'
import { hrApplications, hrJobOpenings } from '../data/hrDemoData'
import { Calendar, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const HRShortlisted = () => {
  const [applications, setApplications] = useState(hrApplications)
  const [scheduleContext, setScheduleContext] = useState(null)
  const shortlisted = applications.filter(app => app.status === 'Shortlisted')

  const grouped = useMemo(() => {
    const jobMap = Object.fromEntries(hrJobOpenings.map(job => [job.id, job.title]))
    return shortlisted.reduce((acc, candidate) => {
      const jobTitle = jobMap[candidate.jobId] || candidate.jobId
      acc[jobTitle] = acc[jobTitle] || []
      acc[jobTitle].push(candidate)
      return acc
    }, {})
  }, [shortlisted])

  const rejectCandidate = (id) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'Rejected' } : app))
    toast.error('Candidate moved to Rejected')
  }

  const openScheduleModal = (candidate, jobTitle) => {
    setScheduleContext({
      candidateName: candidate.studentName,
      jobTitle
    })
  }

  const handleSchedule = (e) => {
    e.preventDefault()
    // For now we only show a toast and rely on local state.
    // Later this can push to a shared interview schedule store / API.
    toast.success('Interview scheduled for candidate')
    setScheduleContext(null)
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

        {Object.entries(grouped).map(([jobTitle, candidates]) => (
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
                <div key={candidate.id} className="p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{candidate.studentName}</p>
                      <p className="text-xs text-slate-500">
                        {candidate.department} · match {candidate.match}%
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">{candidate.submittedAt}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {candidate.skills.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => openScheduleModal(candidate, jobTitle)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Interview
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => rejectCandidate(candidate.id)}
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

        {shortlisted.length === 0 && (
          <Card className="text-center py-12 text-slate-500">
            No shortlisted candidates yet.
          </Card>
        )}
      </div>

      <Modal
        isOpen={!!scheduleContext}
        onClose={() => setScheduleContext(null)}
        title="Schedule Interview"
        size="md"
      >
        {scheduleContext && (
          <form onSubmit={handleSchedule} className="space-y-4 text-sm text-slate-700">
            <FormInput
              label="Candidate Name"
              value={scheduleContext.candidateName}
              readOnly
            />
            <FormInput label="Job Title" value={scheduleContext.jobTitle} readOnly />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Mode</label>
                <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Round Type</label>
                <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                  <option>Technical</option>
                  <option>HR</option>
                  <option>Managerial</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Date" type="date" required />
              <FormInput label="Time" type="time" required />
            </div>
            <FormInput label="Interviewer Name (optional)" />
            <div className="flex gap-3 mt-2">
              <Button type="submit" variant="primary">
                Schedule Interview
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setScheduleContext(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </HRLayout>
  )
}

export default HRShortlisted

