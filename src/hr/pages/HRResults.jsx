import { useMemo, useState } from 'react'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import { hrResults, hrJobOpenings } from '../data/hrDemoData'
import { Trophy, Send, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const HRResults = () => {
  const [offerPreview, setOfferPreview] = useState(null)

  const groupedByJob = useMemo(() => {
    const jobMap = Object.fromEntries(hrJobOpenings.map(job => [job.title, job]))
    const groups = {}
    hrResults.selected.forEach(entry => {
      const jobKey = entry.jobTitle
      if (!groups[jobKey]) {
        groups[jobKey] = {
          job: jobMap[jobKey] || { title: entry.jobTitle },
          candidates: []
        }
      }
      groups[jobKey].candidates.push(entry)
    })
    return groups
  }, [])

  const handleNotify = (candidate) => toast.success(`Notification sent to ${candidate}`)
  const markReviewed = (candidate) => toast.success(`${candidate} marked as reviewed`)

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white p-6 border border-white/10 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Results / Offers</p>
          <h1 className="text-3xl font-bold">Publish final outcomes</h1>
          <p className="text-slate-300">
            Selections and offers here will later sync to the Student Placement portal once APIs are
            connected.
          </p>
        </div>

        {/* Job-wise offer summary */}
        <div className="space-y-4">
          {Object.entries(groupedByJob).map(([jobTitle, group]) => (
            <Card key={jobTitle} className="border border-emerald-100 bg-emerald-50/60">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-emerald-600">Job</p>
                  <h2 className="text-xl font-bold text-emerald-900">{jobTitle}</h2>
                  <p className="text-xs text-emerald-700">{group.job.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-emerald-700">
                    Total Selected: {group.candidates.length}
                  </span>
                  <Trophy className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="space-y-3">
                {group.candidates.map(entry => (
                  <div
                    key={entry.candidate}
                    className="p-4 rounded-2xl border border-emerald-100 bg-white/80 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">{entry.candidate}</p>
                      <p className="text-xs text-emerald-700">
                        Offer: {entry.package} · Status: {entry.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        className="text-white"
                        onClick={() => setOfferPreview({ ...entry, company: group.job.company })}
                      >
                        Generate / View Offer Letter
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleNotify(entry.candidate)}
                        className="flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Notify
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Rejected candidates */}
        <Card className="border border-rose-100 bg-rose-50/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-rose-600">Rejected candidates</p>
              <h2 className="text-xl font-bold text-rose-900">Feedback queue</h2>
            </div>
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="space-y-3">
            {hrResults.rejected.map(entry => (
              <div
                key={entry.candidate}
                className="p-4 rounded-2xl border border-rose-100 bg-white/80 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-rose-900">{entry.candidate}</p>
                  <p className="text-xs text-rose-700">{entry.jobTitle}</p>
                  <p className="text-xs text-rose-500 mt-1">
                    Reason: {entry.reason || 'Not specified'}
                  </p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => markReviewed(entry.candidate)}>
                  Mark reviewed
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={!!offerPreview}
        onClose={() => setOfferPreview(null)}
        title="Offer Letter"
        size="md"
      >
        {offerPreview && (
          <div className="space-y-4 text-sm text-slate-700">
            <p className="text-xs text-slate-500">Offer ID: {offerPreview.offerId}</p>
            <p>Dear {offerPreview.candidate},</p>
            <p>
              We are delighted to extend to you an offer for the position of{' '}
              <span className="font-semibold">{offerPreview.jobTitle}</span> at{' '}
              <span className="font-semibold">{offerPreview.company}</span>.
            </p>
            <p>
              Your total compensation for this role will be{' '}
              <span className="font-semibold">{offerPreview.package}</span>. The detailed terms of
              employment, onboarding schedule, and reporting manager information will be shared in a
              formal document by our HR team.
            </p>
            <p>
              Please confirm your acceptance of this offer within the timeline communicated by the
              campus placement cell.
            </p>
            <p>Warm regards,</p>
            <p className="font-semibold">
              {offerPreview.company} · Campus Recruitment Team
            </p>
          </div>
        )}
      </Modal>
    </HRLayout>
  )
}

export default HRResults

