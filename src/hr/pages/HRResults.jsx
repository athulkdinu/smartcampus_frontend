import { useEffect, useMemo, useState } from 'react'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import FormInput from '../../shared/components/FormInput'
import { Trophy, Send, XCircle, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchHrOffersAPI, fetchAllApplicationsForHrAPI, sendOfferAPI } from '../../services/placementAPI'
import SERVERURL from '../../services/serverURL'

const HRResults = () => {
  const [offers, setOffers] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [offerPreview, setOfferPreview] = useState(null)
  const [showSendOfferModal, setShowSendOfferModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [offerForm, setOfferForm] = useState({
    ctc: '',
    offerLetter: null
  })
  const [sending, setSending] = useState(false)

  const loadData = async () => {
    setLoading(true)
    const [offersRes, appsRes] = await Promise.all([
      fetchHrOffersAPI(),
      fetchAllApplicationsForHrAPI()
    ])
    if (offersRes?.status === 200) {
      setOffers(offersRes.data.offers || [])
    } else {
      toast.error(offersRes?.response?.data?.message || 'Unable to load offers')
    }
    if (appsRes?.status === 200) {
      setApplications(appsRes.data.applications || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const groupedByJob = useMemo(() => {
    const groups = {}
    offers.forEach(offer => {
      const jobTitle = offer.job?.title || 'Unknown Job'
      if (!groups[jobTitle]) {
        groups[jobTitle] = {
          job: offer.job || { title: jobTitle },
          candidates: []
        }
      }
      groups[jobTitle].candidates.push({
        id: offer._id,
        candidate: offer.student?.name || 'Unknown',
        package: offer.ctc,
        status: offer.status,
        offerId: offer._id,
        jobTitle: offer.job?.title,
        offerLetterUrl: offer.offerLetterUrl
      })
    })
    return groups
  }, [offers])

  const rejectedApplications = useMemo(() => {
    return applications.filter(app => app.status === 'Rejected').map(app => ({
      candidate: app.student?.name || 'Unknown',
      jobTitle: app.job?.title || 'Unknown',
      reason: app.notes || 'Not specified'
    }))
  }, [applications])

  const handleSendOffer = (application) => {
    setSelectedApplication(application)
    setOfferForm({ ctc: '', offerLetter: null })
    setShowSendOfferModal(true)
  }

  const handleSubmitOffer = async () => {
    if (!offerForm.ctc) {
      toast.error('Please enter CTC')
      return
    }

    setSending(true)
    const formData = new FormData()
    formData.append('ctc', offerForm.ctc)
    formData.append('status', 'Pending')
    if (offerForm.offerLetter) {
      formData.append('offerLetter', offerForm.offerLetter)
    }

    const res = await sendOfferAPI(selectedApplication._id, formData)
    if (res?.status === 201) {
      toast.success('Offer sent successfully')
      setShowSendOfferModal(false)
      loadData()
    } else {
      toast.error(res?.response?.data?.message || 'Failed to send offer')
    }
    setSending(false)
  }

  const handleNotify = (candidate) => toast.success(`Notification sent to ${candidate}`)
  const markReviewed = (candidate) => toast.success(`${candidate} marked as reviewed`)

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white p-6 border border-white/10 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Results / Offers</p>
          <h1 className="text-3xl font-bold">Publish final outcomes</h1>
          <p className="text-slate-300">
            Send offers to selected candidates and manage offer letters.
          </p>
        </div>

        {loading && (
          <Card>
            <div className="text-center py-8 text-slate-500">Loading offers...</div>
          </Card>
        )}

        {/* Job-wise offer summary */}
        {!loading && (
          <div className="space-y-4">
            {Object.keys(groupedByJob).length === 0 ? (
              <Card>
                <div className="text-center py-8 text-slate-500">
                  No offers sent yet. Send offers from the Applications page.
                </div>
              </Card>
            ) : (
              Object.entries(groupedByJob).map(([jobTitle, group]) => (
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
              ))
            )}
          </div>
        )}

        {/* Send Offer Button for Shortlisted Applications */}
        {!loading && applications.filter(app => app.status === 'Shortlisted').length > 0 && (
          <Card>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Send Offers to Shortlisted Candidates</h3>
            <div className="space-y-2">
              {applications.filter(app => app.status === 'Shortlisted').map(app => (
                <div key={app._id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">{app.student?.name || 'Unknown'}</p>
                    <p className="text-sm text-slate-600">{app.job?.title}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleSendOffer(app)}
                  >
                    Send Offer
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

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
            {rejectedApplications.length === 0 ? (
              <div className="text-center py-4 text-slate-500">No rejected candidates</div>
            ) : (
              rejectedApplications.map((entry, idx) => (
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
              ))
            )}
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

      {/* Send Offer Modal */}
      <Modal
        isOpen={showSendOfferModal}
        onClose={() => setShowSendOfferModal(false)}
        title="Send Offer Letter"
        size="md"
      >
        {selectedApplication && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Candidate</p>
              <p className="font-semibold text-slate-900">{selectedApplication.student?.name || 'Unknown'}</p>
              <p className="text-sm text-slate-600 mt-1">Job</p>
              <p className="font-semibold text-slate-900">{selectedApplication.job?.title}</p>
            </div>

            <FormInput
              label="CTC / Package"
              value={offerForm.ctc}
              onChange={(e) => setOfferForm({ ...offerForm, ctc: e.target.value })}
              placeholder="e.g., ₹9.5 LPA or ₹35,000/month"
              required
            />

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Offer Letter (PDF, optional)
              </label>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <Upload className="w-4 h-4" />
                {offerForm.offerLetter ? offerForm.offerLetter.name : 'Upload PDF'}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setOfferForm({ ...offerForm, offerLetter: e.target.files?.[0] || null })}
                />
              </label>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                variant="primary"
                onClick={handleSubmitOffer}
                disabled={sending || !offerForm.ctc}
              >
                {sending ? 'Sending...' : 'Send Offer'}
              </Button>
              <Button variant="secondary" onClick={() => setShowSendOfferModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </HRLayout>
  )
}

export default HRResults

