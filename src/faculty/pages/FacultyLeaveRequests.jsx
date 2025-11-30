import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Calendar, User, Filter, CheckCircle2, XCircle, FileText, Download } from 'lucide-react'
import { getFacultyLeaveRequestsAPI, updateLeaveStatusAPI } from '../../services/api'
import SERVERURL from '../../services/serverURL'

const filters = ['all', 'pending', 'approved', 'rejected']

const FacultyLeaveRequests = () => {
  const [activeFilter, setActiveFilter] = useState('pending')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)

  useEffect(() => {
    loadLeaveRequests()
  }, [])

  const loadLeaveRequests = async () => {
    try {
      setLoading(true)
      const res = await getFacultyLeaveRequestsAPI()
      if (res?.status === 200) {
        setRequests(res.data.leaveRequests || [])
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

  const handleDecision = async (id, decision) => {
    try {
      setProcessing(id)
      const res = await updateLeaveStatusAPI(id, decision)
      if (res?.status === 200) {
        toast.success(`Request ${decision} successfully`)
        await loadLeaveRequests() // Refresh list
      } else {
        const message = res?.response?.data?.message || `Failed to ${decision} request`
        toast.error(message)
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Something went wrong'
      toast.error(message)
    } finally {
      setProcessing(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const filteredRequests =
    activeFilter === 'all'
      ? requests
      : requests.filter((request) => request.status === activeFilter)

  const pendingCount = requests.filter((req) => req.status === 'pending').length

  return (
    <FacultyLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Student Services</p>
            <h1 className="text-3xl font-bold text-slate-900">Leave Requests</h1>
            <p className="text-slate-600">
              Approve or reject requests — decisions sync to the student portal instantly.
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-700 text-sm font-semibold">
            {pendingCount} pending
          </div>
        </div>

        <Card>
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </Card>

        {loading ? (
          <Card>
            <p className="text-sm text-slate-500 text-center py-8">Loading leave requests...</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((request, idx) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {request.student?.name || 'Unknown Student'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {request.student?.studentID || 'N/A'} · {request.student?.className || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        request.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : request.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="p-3 rounded-xl bg-slate-50">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">From</p>
                      <p className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {formatDate(request.startDate)}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">To</p>
                      <p className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {formatDate(request.endDate)}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Documents</p>
                      <p className="text-slate-700">
                        {request.fileUrl ? '1 file' : 'No file'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">Reason:</span> {request.reason}
                  </p>
                  <p className="text-xs text-slate-500">
                    Submitted on {formatDate(request.createdAt)}
                    {request.reviewedBy && (
                      <>
                        {' · '}
                        Reviewed by {request.reviewedBy.name} on {formatDate(request.reviewedAt)}
                      </>
                    )}
                  </p>
                  {request.remarks && (
                    <p className="text-xs text-red-600">
                      <span className="font-semibold">Remarks:</span> {request.remarks}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {request.status === 'pending' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleDecision(request._id, 'approved')}
                          loading={processing === request._id}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDecision(request._id, 'rejected')}
                          loading={processing === request._id}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    {request.fileUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`${SERVERURL}${request.fileUrl}`, '_blank')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Proof
                        <Download className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}

            {filteredRequests.length === 0 && (
              <Card className="lg:col-span-2">
                <div className="text-center py-12">
                  <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No requests under this filter.</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </motion.div>
    </FacultyLayout>
  )
}

export default FacultyLeaveRequests
