import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Modal from '../../../shared/components/Modal'
import { Calendar, Plus, CheckCircle2, XCircle, Clock, FileText, Upload, Download } from 'lucide-react'
import { createLeaveRequestAPI, getStudentLeaveRequestsAPI } from '../../../services/api'
import SERVERURL from '../../../services/serverURL'

const LeavePage = () => {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [leaveRequests, setLeaveRequests] = useState([])
  const [form, setForm] = useState({
    reason: '',
    startDate: '',
    endDate: '',
    file: null
  })

  useEffect(() => {
    loadLeaveRequests()
  }, [])

  const loadLeaveRequests = async () => {
    try {
      setLoading(true)
      const res = await getStudentLeaveRequestsAPI()
      if (res?.status === 200) {
        setLeaveRequests(res.data.leaveRequests || [])
      } else {
        toast.error('Failed to load leave requests')
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load leave requests'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', badge: 'bg-green-50 text-green-700' }
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-50 text-red-700' }
      default:
        return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', badge: 'bg-amber-50 text-amber-700' }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      setForm(prev => ({ ...prev, file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.reason.trim() || !form.startDate || !form.endDate) {
      toast.error('Please fill all required fields')
      return
    }

    if (new Date(form.startDate) > new Date(form.endDate)) {
      toast.error('End date must be after start date')
      return
    }

    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append('reason', form.reason.trim())
      formData.append('startDate', form.startDate)
      formData.append('endDate', form.endDate)
      if (form.file) {
        formData.append('file', form.file)
      }

      const res = await createLeaveRequestAPI(formData)
      if (res?.status === 201) {
        toast.success('Leave request submitted successfully')
        setShowModal(false)
        setForm({ reason: '', startDate: '', endDate: '', file: null })
        await loadLeaveRequests()
      } else {
        const message = res?.response?.data?.message || 'Failed to submit leave request'
        toast.error(message)
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Something went wrong'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1 // Include both start and end days
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Group requests by status
  const pendingRequests = leaveRequests.filter(r => r.status === 'pending')
  const approvedRequests = leaveRequests.filter(r => r.status === 'approved')
  const rejectedRequests = leaveRequests.filter(r => r.status === 'rejected')

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Academic & Campus</p>
            <h1 className="text-3xl font-bold text-slate-900">Leave Portal</h1>
            <p className="text-slate-600">Submit new requests, attach proofs, and monitor approval stages</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Requests', value: leaveRequests.length, color: 'from-slate-500 to-slate-600' },
            { label: 'Approved', value: approvedRequests.length, color: 'from-green-500 to-green-600' },
            { label: 'Pending', value: pendingRequests.length, color: 'from-amber-500 to-amber-600' },
            { label: 'Rejected', value: rejectedRequests.length, color: 'from-red-500 to-red-600' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {loading ? (
          <Card>
            <p className="text-sm text-slate-500 text-center py-8">Loading leave requests...</p>
          </Card>
        ) : (
          <>
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Pending Requests</h2>
                <div className="grid grid-cols-1 gap-6">
                  {pendingRequests.map((request, idx) => {
                    const config = getStatusConfig(request.status)
                    const Icon = config.icon
                    return (
                      <motion.div
                        key={request._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${config.color}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${config.badge}`}>
                                    {request.status}
                                  </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{request.reason}</h3>
                                <p className="text-sm text-slate-500">Submitted on {formatDate(request.createdAt)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">From</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                {formatDate(request.startDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">To</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                {formatDate(request.endDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Duration</p>
                              <p className="text-sm font-semibold text-slate-900">
                                {calculateDays(request.startDate, request.endDate)} days
                              </p>
                            </div>
                          </div>
                          {request.fileUrl && (
                            <div className="mt-4 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-slate-500" />
                              <a
                                href={`${SERVERURL}${request.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                {request.fileName || 'View attached file'}
                                <Download className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Approved Requests */}
            {approvedRequests.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Approved Requests</h2>
                <div className="grid grid-cols-1 gap-6">
                  {approvedRequests.map((request, idx) => {
                    const config = getStatusConfig(request.status)
                    const Icon = config.icon
                    return (
                      <motion.div
                        key={request._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${config.color}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${config.badge}`}>
                                    {request.status}
                                  </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{request.reason}</h3>
                                <p className="text-sm text-slate-500">Submitted on {formatDate(request.createdAt)}</p>
                                {request.reviewedBy && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    Reviewed by <span className="font-semibold text-slate-800">{request.reviewedBy.name}</span> on {formatDate(request.reviewedAt)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">From</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                {formatDate(request.startDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">To</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                {formatDate(request.endDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Duration</p>
                              <p className="text-sm font-semibold text-slate-900">
                                {calculateDays(request.startDate, request.endDate)} days
                              </p>
                            </div>
                          </div>
                          {request.fileUrl && (
                            <div className="mt-4 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-slate-500" />
                              <a
                                href={`${SERVERURL}${request.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                {request.fileName || 'View attached file'}
                                <Download className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Rejected Requests */}
            {rejectedRequests.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Rejected Requests</h2>
                <div className="grid grid-cols-1 gap-6">
                  {rejectedRequests.map((request, idx) => {
                    const config = getStatusConfig(request.status)
                    const Icon = config.icon
                    return (
                      <motion.div
                        key={request._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${config.color}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${config.badge}`}>
                                    {request.status}
                                  </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{request.reason}</h3>
                                <p className="text-sm text-slate-500">Submitted on {formatDate(request.createdAt)}</p>
                                {request.reviewedBy && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    Reviewed by <span className="font-semibold text-slate-800">{request.reviewedBy.name}</span> on {formatDate(request.reviewedAt)}
                                  </p>
                                )}
                                {request.remarks && (
                                  <p className="text-xs text-red-600 mt-1">
                                    Remarks: {request.remarks}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">From</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                {formatDate(request.startDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">To</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                {formatDate(request.endDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Duration</p>
                              <p className="text-sm font-semibold text-slate-900">
                                {calculateDays(request.startDate, request.endDate)} days
                              </p>
                            </div>
                          </div>
                          {request.fileUrl && (
                            <div className="mt-4 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-slate-500" />
                              <a
                                href={`${SERVERURL}${request.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                {request.fileName || 'View attached file'}
                                <Download className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            {leaveRequests.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No leave requests yet. Create your first request!</p>
                </div>
              </Card>
            )}
          </>
        )}

        {/* New Request Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setForm({ reason: '', startDate: '', endDate: '', file: null })
          }}
          title="New Leave Request"
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Reason <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={form.reason}
                onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter leave reason"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Start Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  End Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Attach Proof (Optional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 mb-2">
                    {form.file ? form.file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-slate-400">PDF, DOC, DOCX, JPG, PNG (Max 5MB)</p>
                </label>
                {form.file && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-600">
                    <FileText className="w-4 h-4" />
                    <span>{form.file.name}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1" loading={submitting}>
                Submit Request
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowModal(false)
                  setForm({ reason: '', startDate: '', endDate: '', file: null })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </motion.div>
    </MainLayout>
  )
}

export default LeavePage
