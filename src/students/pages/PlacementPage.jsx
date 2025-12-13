import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import {
  Briefcase,
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  Trophy,
  Upload
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  applyJobAPI,
  fetchJobsAPI,
  fetchMyApplicationsAPI,
  fetchMyInterviewsAPI,
  fetchMyOffersAPI,
  fetchMyResumeAPI,
  uploadResumeAPI
} from '../../services/placementAPI'

const tabs = [
  { id: 'drives', label: 'Active Drives' },
  { id: 'applications', label: 'My Applications' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'offers', label: 'Offers' },
  { id: 'resume', label: 'Resume' }
]

const PlacementPage = () => {
  const [activeTab, setActiveTab] = useState('drives')
  const [drives, setDrives] = useState([])
  const [applications, setApplications] = useState([])
  const [interviews, setInterviews] = useState([])
  const [offers, setOffers] = useState([])
  const [resume, setResume] = useState({ fileName: null, url: null, updatedAt: null })
  const [applicationDetail, setApplicationDetail] = useState(null)
  const [offerDetail, setOfferDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-')
  const formatTime = (value) =>
    value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

  const toastMessage = (res, fallback) =>
    res?.response?.data?.message || res?.data?.message || fallback

  const normalizeApplications = (items = []) =>
    items.map(app => ({
      id: app._id,
      jobId: app.job?._id,
      title: app.job?.title,
      company: app.job?.company,
      status: app.status,
      lastUpdated: app.updatedAt
        ? new Date(app.updatedAt).toLocaleString()
        : 'Just now'
    }))

  const normalizeInterviews = (items = []) =>
    items.map(int => ({
      id: int._id,
      title: int.job?.title,
      company: int.job?.company,
      mode: int.mode,
      roundType: int.roundType,
      date: formatDate(int.scheduledAt),
      time: formatTime(int.scheduledAt),
      status: int.status
    }))

  const normalizeOffers = (items = []) =>
    items.map(off => ({
      id: off._id,
      jobId: off.job?._id,
      title: off.job?.title,
      company: off.job?.company,
      ctc: off.ctc,
      status: off.status,
      offerLetterUrl: off.offerLetterUrl
    }))

  const loadData = async () => {
    try {
      setRefreshing(true)
      const [jobsRes, appsRes, intRes, offersRes, resumeRes] = await Promise.all([
        fetchJobsAPI({ status: 'Active' }),
        fetchMyApplicationsAPI(),
        fetchMyInterviewsAPI(),
        fetchMyOffersAPI(),
        fetchMyResumeAPI()
      ])

      if (jobsRes?.status === 200) {
        const normalizedJobs =
          jobsRes.data?.jobs?.map(job => ({
            id: job._id,
            title: job.title,
            company: job.company,
            location: job.location || job.mode || '',
            mode: job.mode,
            jobType: job.jobType,
            status: job.status,
            deadline: job.deadline
          })) || []
        setDrives(normalizedJobs)
      } else {
        toast.error(toastMessage(jobsRes, 'Unable to load jobs'))
      }

      if (appsRes?.status === 200) {
        setApplications(normalizeApplications(appsRes.data?.applications || []))
      } else {
        toast.error(toastMessage(appsRes, 'Unable to load applications'))
      }

      if (intRes?.status === 200) {
        setInterviews(normalizeInterviews(intRes.data?.interviews || []))
      }

      if (offersRes?.status === 200) {
        setOffers(normalizeOffers(offersRes.data?.offers || []))
      }

      if (resumeRes?.status === 200) {
        setResume({
          fileName: resumeRes.data?.resumeOriginalName || null,
          url: resumeRes.data?.resumeUrl || null,
          updatedAt: resumeRes.data?.resumeUpdatedAt || null
        })
      }
    } catch (err) {
      console.error(err)
      toast.error('Unable to load placement data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const refreshApplications = async () => {
    const res = await fetchMyApplicationsAPI()
    if (res?.status === 200) {
      setApplications(normalizeApplications(res.data?.applications || []))
    }
  }

  const stats = useMemo(() => {
    const activeDrivesCount = drives.filter(d => d.status === 'Active').length
    const applicationsCount = applications.length
    const shortlistedCount = applications.filter(a =>
      ['Shortlisted', 'Interview Scheduled', 'Offered'].includes(a.status)
    ).length
    const interviewsCount = interviews.length
    const offersCount = offers.length

    return {
      activeDrivesCount,
      applicationsCount,
      shortlistedCount,
      interviewsCount,
      offersCount
    }
  }, [drives, applications, interviews, offers])

  const handleApply = (drive) => {
    const applyNow = async () => {
      const alreadyApplied = applications.some(app => app.jobId === drive.id)
      if (alreadyApplied) {
        toast.info('You have already applied to this job')
        setActiveTab('applications')
        return
      }

      // Check if student has a resume uploaded
      if (!resume.url) {
        toast.error('Please upload your resume first before applying to jobs')
        setActiveTab('resume')
        return
      }

      // Send empty FormData - backend will use existing resume from student profile
      const formData = new FormData()
      const res = await applyJobAPI(drive.id, formData)
      if (res?.status === 201) {
        toast.success('Application submitted successfully')
        refreshApplications()
        setActiveTab('applications')
      } else {
        const errorMsg = res?.response?.data?.message || 'Unable to apply'
        toast.error(errorMsg)
      }
    }

    applyNow()
  }

  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const upload = async () => {
      const formData = new FormData()
      formData.append('resume', file)
      const res = await uploadResumeAPI(formData)
      if (res?.status === 200) {
        setResume({
          fileName: res.data.resumeOriginalName || file.name,
          url: res.data.resumeUrl,
          updatedAt: res.data.resumeUpdatedAt
        })
        toast.success('Resume uploaded')
      } else {
        toast.error(toastMessage(res, 'Unable to upload resume'))
      }
    }
    upload()
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-sm text-slate-600">Loading placement data...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Placement & Internships</h1>
            <p className="text-slate-600">
              Track drives, applications, interviews, and offers in one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={loadData}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] gap-6">
          {/* Summary cards */}
          <div className="space-y-4">
            {[
              {
                label: 'Active Drives',
                value: stats.activeDrivesCount,
                icon: Briefcase,
                color: 'from-blue-500 to-blue-600'
              },
              {
                label: 'Applications Submitted',
                value: stats.applicationsCount,
                icon: FileText,
                color: 'from-emerald-500 to-emerald-600'
              },
              {
                label: 'Shortlisted',
                value: stats.shortlistedCount,
                icon: CheckCircle2,
                color: 'from-purple-500 to-purple-600'
              },
              {
                label: 'Interviews Scheduled',
                value: stats.interviewsCount,
                icon: Calendar,
                color: 'from-orange-500 to-orange-600'
              },
              {
                label: 'Offers Received',
                value: stats.offersCount,
                icon: Trophy,
                color: 'from-sky-500 to-sky-600'
              }
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Right side tabs + content */}
          <div className="space-y-4">
            {/* Tabs */}
            <Card className="p-2 border border-slate-100 bg-slate-50/80">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Tab content */}
            {activeTab === 'drives' && (
              <Card>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Active Placement Drives</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                  {drives.map((drive, idx) => (
                    <motion.div
                      key={drive.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="p-5 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">{drive.company}</p>
                          <h3 className="font-semibold text-slate-900">{drive.title}</h3>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                          {drive.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{drive.location}</p>
                      <p className="text-xs text-slate-500 mb-2">
                        Last date to apply: <span className="font-medium">{formatDate(drive.deadline)}</span>
                      </p>
                      <p className="text-xs text-slate-500 mb-4">
                        {drive.jobType || 'Role'} · {drive.mode || 'Mode TBA'}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleApply(drive)}
                        >
                          Apply
                        </Button>
                        <Button variant="secondary" size="sm" className="flex-1">
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  {drives.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No active drives right now. Check back soon.
                    </p>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'applications' && (
              <Card>
                <h2 className="text-xl font-bold text-slate-900 mb-4">My Applications</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-slate-200">
                        <th className="py-3 pr-4">Job</th>
                        <th className="py-3 pr-4">Company</th>
                        <th className="py-3 pr-4">Status</th>
                        <th className="py-3 pr-4">Last Updated</th>
                        <th className="py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr
                          key={app.id}
                          className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                          onClick={() => setApplicationDetail(app)}
                        >
                          <td className="py-3 pr-4 text-slate-900">{app.title}</td>
                          <td className="py-3 pr-4 text-slate-700">{app.company}</td>
                          <td className="py-3 pr-4">
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
                          </td>
                          <td className="py-3 pr-4 text-slate-500">{app.lastUpdated}</td>
                          <td className="py-3">
                            {(app.status === 'Shortlisted' || app.status === 'Interview Scheduled') && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveTab('interviews')
                                }}
                              >
                                View Interview Details
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {applications.length === 0 && (
                        <tr>
                          <td
                            className="py-6 text-center text-slate-500"
                            colSpan={5}
                          >
                            No applications yet. Apply to an active drive to see it here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {activeTab === 'interviews' && (
              <Card>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Interview Schedule</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                      Upcoming Interviews
                    </p>
                    <div className="space-y-3">
                      {interviews.filter(i => i.status === 'Scheduled').map((interview) => (
                        <div
                          key={interview.id}
                          className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{interview.title}</p>
                            <p className="text-xs text-slate-500">{interview.company}</p>
                          </div>
                          <div className="text-sm text-slate-600">
                            <div>{interview.mode} · {interview.roundType}</div>
                            <div className="text-xs text-slate-500">
                              {interview.date} · {interview.time}
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                            Scheduled
                          </span>
                        </div>
                      ))}
                      {interviews.filter(i => i.status === 'Scheduled').length === 0 && (
                        <p className="text-sm text-slate-500">
                          No upcoming interviews scheduled yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                      Past Interviews
                    </p>
                    <div className="space-y-3">
                      {interviews.filter(i => i.status === 'Completed').map((interview) => (
                        <div
                          key={interview.id}
                          className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{interview.title}</p>
                            <p className="text-xs text-slate-500">{interview.company}</p>
                          </div>
                          <div className="text-sm text-slate-600">
                            <div>{interview.mode} · {interview.roundType}</div>
                            <div className="text-xs text-slate-500">
                              {interview.date} · {interview.time}
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                            Completed
                          </span>
                        </div>
                      ))}
                      {interviews.filter(i => i.status === 'Completed').length === 0 && (
                        <p className="text-sm text-slate-500">
                          Past interviews will appear here after completion.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'offers' && (
              <Card>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Offer Letters</h2>
                <div className="space-y-3">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{offer.title}</p>
                        <p className="text-xs text-slate-500">{offer.company}</p>
                      </div>
                      <div className="text-sm text-slate-600">
                        <div>{offer.ctc}</div>
                        <div className="text-xs text-slate-500">Status: {offer.status}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setOfferDetail(offer)}
                      >
                        View Offer Letter
                      </Button>
                    </div>
                  ))}
                  {offers.length === 0 && (
                    <p className="text-sm text-slate-500">
                      Offer letters from recruiters will appear here.
                    </p>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'resume' && (
              <Card>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Resume</h2>
                {!resume.fileName ? (
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-slate-600">
                      Upload your latest resume (PDF). This will be shared with recruiters when you apply.
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium cursor-pointer hover:bg-indigo-700 transition">
                      <Upload className="w-4 h-4" />
                      Upload Resume (PDF)
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleResumeUpload}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Current resume</p>
                      <p className="text-sm text-slate-600 mt-1">{resume.fileName}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium cursor-pointer hover:bg-indigo-700 transition">
                        <Upload className="w-4 h-4" />
                        Replace
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={handleResumeUpload}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </motion.div>

      {/* Application detail modal */}
      <Modal
        isOpen={!!applicationDetail}
        onClose={() => setApplicationDetail(null)}
        title="Application Details"
        size="md"
      >
        {applicationDetail && (
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Job</p>
              <h3 className="text-lg font-semibold text-slate-900">{applicationDetail.title}</h3>
              <p className="text-xs text-slate-500">{applicationDetail.company}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Current status</p>
              <p className="mt-1">{applicationDetail.status}</p>
              <p className="text-xs text-slate-500 mt-1">
                Last updated: {applicationDetail.lastUpdated}
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Interview information</p>
              <p className="mt-1 text-xs text-slate-500">
                Any scheduled interview rounds for this role will appear under the Interviews tab.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Final result</p>
              <p className="mt-1 text-xs text-slate-500">
                Once offers are released, you will see the details in the Offers tab.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Offer letter modal */}
      <Modal
        isOpen={!!offerDetail}
        onClose={() => setOfferDetail(null)}
        title="Offer Letter"
        size="md"
      >
        {offerDetail && (
          <div className="space-y-4 text-sm text-slate-700">
            <p className="text-xs text-slate-500">Offer ID: {offerDetail.id}</p>
            <p>Dear Student,</p>
            <p>
              We are pleased to offer you the role of{' '}
              <span className="font-semibold">{offerDetail.title}</span> at{' '}
              <span className="font-semibold">{offerDetail.company}</span>.
            </p>
            <p>
              Your compensation for this role will be{' '}
              <span className="font-semibold">{offerDetail.ctc}</span>. Detailed joining
              instructions, reporting date, and pre-joining formalities will be shared by the
              campus placement cell.
            </p>
            <p>
              Kindly review the terms and confirm your acceptance through the Placement &amp;
              Internships portal.
            </p>
            <p>Warm regards,</p>
            <p className="font-semibold">{offerDetail.company} · Campus Hiring Team</p>
          </div>
        )}
      </Modal>
    </MainLayout>
  )
}

export default PlacementPage

