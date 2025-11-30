import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import { AlertTriangle, CheckCircle2, XCircle, MessageSquare, Eye, User } from 'lucide-react'
import { getAdminInboxAPI, adminActionAPI, getComplaintDetailsAPI } from '../../services/complaintAPI'

const AdminComplaintManagement = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionModal, setActionModal] = useState({ open: false, complaintId: null, actionType: null, comment: '' })

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = async () => {
    try {
      setLoading(true)
      const res = await getAdminInboxAPI()
      if (res?.status === 200) {
        setComplaints(res.data.complaints || [])
      } else {
        toast.error(res?.response?.data?.message || 'Failed to load complaints')
      }
    } catch (error) {
      console.error('Error loading complaints:', error)
      toast.error('Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (complaint) => {
    try {
      setDetailLoading(true)
      const res = await getComplaintDetailsAPI(complaint._id || complaint.id)
      if (res?.status === 200) {
        setSelectedComplaint(res.data.complaint)
      } else {
        toast.error('Failed to load complaint details')
      }
    } catch (error) {
      console.error('Error loading details:', error)
      toast.error('Failed to load complaint details')
    } finally {
      setDetailLoading(false)
    }
  }

  const openActionModal = (complaintId, actionType) => {
    setActionModal({ open: true, complaintId, actionType, comment: '' })
  }

  const handleAction = async () => {
    if (!actionModal.comment && actionModal.actionType === 'comment') {
      toast.error('Please provide a comment')
      return
    }

    try {
      const res = await adminActionAPI(actionModal.complaintId, {
        actionType: actionModal.actionType,
        comment: actionModal.comment || ''
      })

      if (res?.status === 200) {
        const actionLabels = {
          resolve: 'resolved',
          reject: 'rejected',
          comment: 'comment added'
        }
        toast.success(`Complaint ${actionLabels[actionModal.actionType] || 'updated'}`)
        setActionModal({ open: false, complaintId: null, actionType: null, comment: '' })
        await loadComplaints()
        setSelectedComplaint(null)
      } else {
        toast.error(res?.response?.data?.message || 'Failed to perform action')
      }
    } catch (error) {
      console.error('Error performing action:', error)
      toast.error(error?.response?.data?.message || 'Failed to perform action')
    }
  }

  const activeComplaints = complaints.filter(c => ['pending_admin', 'pending_faculty'].includes(c.status))
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved')
  const rejectedComplaints = complaints.filter(c => c.status === 'rejected')

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-rose-900 text-white p-6 border border-white/10">
          <p className="text-xs uppercase tracking-[0.35em] text-rose-200">Escalation Center</p>
          <h1 className="text-3xl font-bold mt-2">Complaint Management</h1>
          <p className="text-slate-200 mt-2">Review and resolve complaints from students and faculty.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Active Complaints', value: activeComplaints.length, color: 'from-rose-500 to-rose-600' },
            { label: 'Resolved', value: resolvedComplaints.length, color: 'from-green-500 to-green-600' },
            { label: 'Rejected', value: rejectedComplaints.length, color: 'from-slate-500 to-slate-600' }
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
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Active Complaints */}
        <Card className="border border-slate-100/10 bg-white/85 backdrop-blur">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Requires Action</p>
              <h2 className="text-2xl font-bold text-slate-900">Active Complaints</h2>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-rose-50 text-rose-700 text-sm font-semibold">
              {activeComplaints.length} awaiting action
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading complaints...</p>
            </div>
          ) : activeComplaints.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No active complaints.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeComplaints.map((complaint) => (
                <motion.div
                  key={complaint._id || complaint.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs uppercase tracking-wide text-slate-500">
                              {complaint.raisedBy?.role === 'student' ? 'From Student' : 'From Faculty'}
                            </span>
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                              {complaint.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-slate-900">{complaint.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-slate-200 text-slate-800">
                            {complaint.status}
                          </span>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleViewDetails(complaint)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">{complaint.description}</p>
                      <div className="text-xs text-slate-500 flex flex-wrap gap-3">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {complaint.raisedBy?.name || 'Unknown'}
                        </span>
                        {complaint.targetClassId && (
                          <span>Class: {complaint.targetClassId?.className || 'N/A'}</span>
                        )}
                        <span>Updated: {new Date(complaint.updatedAt || complaint.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200">
                    <Button size="sm" variant="success" onClick={() => openActionModal(complaint._id || complaint.id, 'resolve')}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => openActionModal(complaint._id || complaint.id, 'reject')}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-700" onClick={() => openActionModal(complaint._id || complaint.id, 'comment')}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Resolved/Rejected Complaints */}
        {(resolvedComplaints.length > 0 || rejectedComplaints.length > 0) && (
          <Card className="border border-emerald-100 bg-emerald-50/70">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-600">Closed Loop</p>
                <h2 className="text-xl font-bold text-emerald-900">Resolved & Rejected Complaints</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-white text-emerald-700 text-sm font-semibold">
                {resolvedComplaints.length + rejectedComplaints.length}
              </span>
            </div>
            <div className="space-y-3">
              {[...resolvedComplaints, ...rejectedComplaints].slice(0, 5).map((complaint) => (
                <div key={complaint._id || complaint.id} className="p-4 rounded-2xl border border-emerald-100 bg-white/80">
                  <p className="text-sm font-semibold text-emerald-900">{complaint.title}</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    {complaint.status} · {complaint.raisedBy?.name || 'Unknown'} · {new Date(complaint.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Modal */}
        <Modal
          isOpen={actionModal.open}
          onClose={() => setActionModal({ open: false, complaintId: null, actionType: null, comment: '' })}
          title={
            actionModal.actionType === 'resolve' ? 'Resolve Complaint' :
            actionModal.actionType === 'reject' ? 'Reject Complaint' :
            'Add Comment'
          }
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Comment {actionModal.actionType === 'comment' ? '*' : actionModal.actionType === 'resolve' ? '(Optional)' : '*'}
              </label>
              <textarea
                rows={4}
                value={actionModal.comment}
                onChange={(e) => setActionModal({ ...actionModal, comment: e.target.value })}
                placeholder="Add your comment or remarks..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                required={actionModal.actionType === 'comment' || actionModal.actionType === 'reject'}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="primary" className="flex-1" onClick={handleAction}>
                Confirm
              </Button>
              <Button
                variant="secondary"
                onClick={() => setActionModal({ open: false, complaintId: null, actionType: null, comment: '' })}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Complaint Detail Modal */}
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title="Complaint Details"
          size="lg"
        >
          {detailLoading ? (
            <div className="text-center py-8">
              <p className="text-slate-500">Loading details...</p>
            </div>
          ) : selectedComplaint ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                    {selectedComplaint.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {selectedComplaint.status}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs">
                    Source: {selectedComplaint.raisedBy?.role || 'Unknown'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedComplaint.title}</h3>
                <p className="text-slate-600">{selectedComplaint.description}</p>
                <div className="text-sm text-slate-500 space-y-1">
                  <p>Raised by: {selectedComplaint.raisedBy?.name || 'Unknown'}</p>
                  {selectedComplaint.targetClassId && (
                    <p>Class: {selectedComplaint.targetClassId?.className || 'N/A'}</p>
                  )}
                  {selectedComplaint.targetFacultyId && (
                    <p>Faculty: {selectedComplaint.targetFacultyId?.name || 'N/A'}</p>
                  )}
                  <p>Created: {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-semibold text-slate-900 mb-4">Timeline</h4>
                <div className="space-y-4">
                  {selectedComplaint.history && selectedComplaint.history.length > 0 ? (
                    selectedComplaint.history.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                          {idx < selectedComplaint.history.length - 1 && (
                            <div className="w-0.5 h-full bg-slate-200 ml-0.5 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-900">{item.action}</span>
                            <span className="text-xs text-slate-500">by {item.actorRole}</span>
                            <span className="text-xs text-slate-400">
                              {new Date(item.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {item.comment && (
                            <p className="text-sm text-slate-600 mt-1">{item.comment}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No timeline entries yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </AdminLayout>
  )
}

export default AdminComplaintManagement
