import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import { AlertTriangle, CheckCircle2, XCircle, Share2, ClipboardList, MessageSquare, Eye } from 'lucide-react'
import {
  getFacultyInboxAPI,
  createFacultyComplaintAPI,
  getFacultyComplaintsAPI,
  getAdminResolvedComplaintsAPI,
  facultyActionAPI,
  getComplaintDetailsAPI
} from '../../services/complaintAPI'

const FacultyComplaints = () => {
  const [activeTab, setActiveTab] = useState('from-students')
  const [inboxComplaints, setInboxComplaints] = useState([])
  const [myComplaints, setMyComplaints] = useState([])
  const [adminResolved, setAdminResolved] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionModal, setActionModal] = useState({ open: false, complaintId: null, actionType: null, comment: '' })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({ category: 'Academic', title: '', description: '' })

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'from-students') {
        const res = await getFacultyInboxAPI()
        if (res?.status === 200) {
          setInboxComplaints(res.data.complaints || [])
        }
      } else if (activeTab === 'my-complaints') {
        const res = await getFacultyComplaintsAPI()
        if (res?.status === 200) {
          setMyComplaints(res.data.complaints || [])
        }
      } else if (activeTab === 'admin-resolved') {
        const res = await getAdminResolvedComplaintsAPI()
        if (res?.status === 200) {
          setAdminResolved(res.data.complaints || [])
        }
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
    if (!actionModal.comment && actionModal.actionType !== 'resolve') {
      toast.error('Please provide a comment')
      return
    }

    try {
      const res = await facultyActionAPI(actionModal.complaintId, {
        actionType: actionModal.actionType,
        comment: actionModal.comment
      })

      if (res?.status === 200) {
        toast.success(`Complaint ${actionModal.actionType === 'resolve' ? 'resolved' : actionModal.actionType === 'reject' ? 'rejected' : 'escalated'}`)
        setActionModal({ open: false, complaintId: null, actionType: null, comment: '' })
        await loadData()
        setSelectedComplaint(null)
      } else {
        toast.error(res?.response?.data?.message || 'Failed to perform action')
      }
    } catch (error) {
      console.error('Error performing action:', error)
      toast.error(error?.response?.data?.message || 'Failed to perform action')
    }
  }

  const handleCreateComplaint = async (e) => {
    e.preventDefault()
    if (!createForm.title || !createForm.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const res = await createFacultyComplaintAPI({
        category: createForm.category,
        title: createForm.title,
        description: createForm.description
      })

      if (res?.status === 201) {
        toast.success('Complaint created successfully')
        setShowCreateModal(false)
        setCreateForm({ category: 'Academic', title: '', description: '' })
        await loadData()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to create complaint')
      }
    } catch (error) {
      console.error('Error creating complaint:', error)
      toast.error(error?.response?.data?.message || 'Failed to create complaint')
    }
  }

  const currentComplaints = activeTab === 'from-students' ? inboxComplaints 
    : activeTab === 'my-complaints' ? myComplaints 
    : adminResolved

  return (
    <FacultyLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Student voice</p>
            <h1 className="text-3xl font-bold text-slate-900">Complaints Center</h1>
            <p className="text-slate-600">Review complaints, resolve quickly, or escalate to admin approvals.</p>
          </div>
          {activeTab === 'my-complaints' && (
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Raise Complaint to Admin
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Card>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'from-students', label: 'From Students', count: inboxComplaints.length },
              { id: 'my-complaints', label: 'My Complaints to Admin', count: myComplaints.length },
              { id: 'admin-resolved', label: 'Admin Resolved - Need Action', count: adminResolved.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </Card>

        {/* Complaints List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-slate-500">Loading complaints...</p>
            </div>
          </Card>
        ) : currentComplaints.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No complaints in this section.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {currentComplaints.map((complaint, idx) => (
              <motion.div
                key={complaint._id || complaint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        {activeTab === 'from-students' && (
                          <p className="text-sm font-semibold text-slate-900">
                            {complaint.raisedBy?.name || 'Student'} · {complaint.raisedBy?.studentID || ''}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mb-1">{complaint.category}</p>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">{complaint.title}</h3>
                        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{complaint.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-slate-100 text-slate-600">
                            {complaint.status}
                          </span>
                          <span className="text-xs text-slate-500">
                            Updated: {new Date(complaint.updatedAt || complaint.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleViewDetails(complaint)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  {activeTab === 'from-students' && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                      <Button size="sm" variant="success" onClick={() => openActionModal(complaint._id || complaint.id, 'resolve')}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Resolve
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => openActionModal(complaint._id || complaint.id, 'reject')}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700" onClick={() => openActionModal(complaint._id || complaint.id, 'escalate')}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Pass to Admin
                      </Button>
                    </div>
                  )}

                  {activeTab === 'admin-resolved' && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                      <Button size="sm" variant="success" onClick={() => openActionModal(complaint._id || complaint.id, 'ack-admin-resolution')}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Resolved for Student
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Complaint Modal (for My Complaints tab) */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false)
            setCreateForm({ category: 'Academic', title: '', description: '' })
          }}
          title="Raise Complaint to Admin"
          size="md"
        >
          <form onSubmit={handleCreateComplaint} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
              <select
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="Academic">Academic</option>
                <option value="Behaviour">Behaviour</option>
                <option value="Facility">Facility</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
              <input
                type="text"
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder="Enter complaint title"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
              <textarea
                rows={4}
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="Describe your complaint in detail"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">Submit Complaint</Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  setShowCreateModal(false)
                  setCreateForm({ category: 'Academic', title: '', description: '' })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Action Modal */}
        <Modal
          isOpen={actionModal.open}
          onClose={() => setActionModal({ open: false, complaintId: null, actionType: null, comment: '' })}
          title={
            actionModal.actionType === 'resolve' ? 'Resolve Complaint' :
            actionModal.actionType === 'reject' ? 'Reject Complaint' :
            actionModal.actionType === 'escalate' ? 'Pass to Admin' :
            'Mark Resolved for Student'
          }
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Comment {actionModal.actionType === 'resolve' && actionModal.actionType !== 'ack-admin-resolution' ? '(Optional)' : '*'}
              </label>
              <textarea
                rows={4}
                value={actionModal.comment}
                onChange={(e) => setActionModal({ ...actionModal, comment: e.target.value })}
                placeholder="Add your comment or remarks..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                required={actionModal.actionType !== 'resolve' || actionModal.actionType === 'ack-admin-resolution'}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="primary" 
                className="flex-1"
                onClick={handleAction}
              >
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
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedComplaint.title}</h3>
                <p className="text-slate-600">{selectedComplaint.description}</p>
                {selectedComplaint.raisedBy && (
                  <p className="text-sm text-slate-500">
                    Raised by: {selectedComplaint.raisedBy.name} ({selectedComplaint.raisedBy.role})
                  </p>
                )}
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
      </motion.div>
    </FacultyLayout>
  )
}

export default FacultyComplaints
