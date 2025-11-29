import { motion } from 'framer-motion'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Modal from '../../../shared/components/Modal'
import { Calendar, Plus, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react'
import { leaveRequests } from '../../data/academicData'
import { useState } from 'react'

const LeavePage = () => {
  const [showModal, setShowModal] = useState(false)

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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Leave Portal</h1>
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
            { label: 'Approved', value: leaveRequests.filter(r => r.status === 'approved').length, color: 'from-green-500 to-green-600' },
            { label: 'Pending', value: leaveRequests.filter(r => r.status === 'pending').length, color: 'from-amber-500 to-amber-600' },
            { label: 'Rejected', value: leaveRequests.filter(r => r.status === 'rejected').length, color: 'from-red-500 to-red-600' }
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

        {/* Leave Requests */}
        <div className="grid grid-cols-1 gap-6">
          {leaveRequests.map((request, idx) => {
            const config = getStatusConfig(request.status)
            const Icon = config.icon
            return (
              <motion.div
                key={request.id}
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
                          <p className="text-xs uppercase tracking-wide text-slate-500">Request #{request.id}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${config.badge}`}>
                            {request.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{request.reason}</h3>
                        <p className="text-sm text-slate-500">Submitted on {request.submittedDate}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Reviewed by <span className="font-semibold text-slate-800">{request.advisor}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">From</p>
                      <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {request.startDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">To</p>
                      <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {request.endDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Duration</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {request.documents} supporting doc(s)
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                      Faculty notified
                    </span>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* New Request Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="New Leave Request"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Reason</label>
              <input
                type="text"
                placeholder="Enter leave reason"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Attach Proof</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="primary" className="flex-1">Submit Request</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </MainLayout>
  )
}

export default LeavePage
