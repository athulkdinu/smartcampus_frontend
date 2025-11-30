import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Modal from '../../../shared/components/Modal'
import { AlertCircle, Plus, CheckCircle2, Clock, FileText, Eye, X } from 'lucide-react'
import { 
  createStudentComplaintAPI, 
  getStudentComplaintsAPI, 
  getComplaintDetailsAPI 
} from '../../../services/complaintAPI'

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [formData, setFormData] = useState({
    category: 'Academic',
    title: '',
    description: ''
  })

  // Status mapping for student view
  const statusLabels = {
    pending_faculty: 'Under Faculty Review',
    pending_admin: 'Under Admin Review',
    resolved: 'Resolved',
    rejected: 'Rejected'
  }

  // Owner labels
  const ownerLabels = {
    student: 'You',
    faculty: 'Faculty',
    admin: 'Admin'
  }

  const statusConfig = {
    pending_faculty: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-50 text-blue-700' },
    pending_admin: { icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', badge: 'bg-purple-50 text-purple-700' },
    resolved: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', badge: 'bg-green-50 text-green-700' },
    rejected: { icon: X, color: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-50 text-red-700' }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = async () => {
    try {
      setLoading(true)
      const res = await getStudentComplaintsAPI()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const res = await createStudentComplaintAPI({
        category: formData.category,
        title: formData.title,
        description: formData.description
      })

      if (res?.status === 201) {
        toast.success('Complaint raised successfully')
        setShowModal(false)
        setFormData({ category: 'Academic', title: '', description: '' })
        await loadComplaints()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to create complaint')
      }
    } catch (error) {
      console.error('Error creating complaint:', error)
      toast.error(error?.response?.data?.message || 'Failed to create complaint')
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

  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    pending_faculty: complaints.filter(c => c.status === 'pending_faculty').length,
    pending_admin: complaints.filter(c => c.status === 'pending_admin').length,
    rejected: complaints.filter(c => c.status === 'rejected').length
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
            <p className="text-sm uppercase tracking-wide text-slate-500">Academic & Campus</p>
            <h1 className="text-3xl font-bold text-slate-900">Complaints Desk</h1>
            <p className="text-slate-600">Raise concerns and track their resolution</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Raise Complaint
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { label: 'Total', value: stats.total, color: 'from-slate-500 to-slate-600' },
            { label: 'Resolved', value: stats.resolved, color: 'from-green-500 to-green-600' },
            { label: 'Under Faculty Review', value: stats.pending_faculty, color: 'from-blue-500 to-blue-600' },
            { label: 'Under Admin Review', value: stats.pending_admin, color: 'from-purple-500 to-purple-600' },
            { label: 'Rejected', value: stats.rejected, color: 'from-red-500 to-red-600' }
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
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Complaints List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-slate-500">Loading complaints...</p>
            </div>
          </Card>
        ) : complaints.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No complaints yet. Raise your first complaint to get started.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {complaints.map((complaint, idx) => {
              const config = statusConfig[complaint.status] || statusConfig.pending_faculty
              const Icon = config.icon
              return (
                <motion.div
                  key={complaint._id || complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${config.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                              {complaint.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
                              {statusLabels[complaint.status] || complaint.status}
                            </span>
                            <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs">
                              Current Owner: {ownerLabels[complaint.currentOwner] || complaint.currentOwner}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{complaint.title}</h3>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{complaint.description}</p>
                          <p className="text-xs text-slate-400">
                            Last updated: {new Date(complaint.updatedAt || complaint.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleViewDetails(complaint)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* New Complaint Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setFormData({ category: 'Academic', title: '', description: '' })
          }}
          title="Raise New Complaint"
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter complaint title"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  setShowModal(false)
                  setFormData({ category: 'Academic', title: '', description: '' })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
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
              {/* Complaint Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                    {selectedComplaint.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusConfig[selectedComplaint.status]?.badge || 'bg-slate-100 text-slate-700'
                  }`}>
                    {statusLabels[selectedComplaint.status] || selectedComplaint.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedComplaint.title}</h3>
                <p className="text-slate-600">{selectedComplaint.description}</p>
                <p className="text-xs text-slate-500">
                  Created: {new Date(selectedComplaint.createdAt).toLocaleString()}
                </p>
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
                            <span className="text-sm font-semibold text-slate-900">
                              {item.action}
                            </span>
                            <span className="text-xs text-slate-500">
                              by {item.actorRole}
                            </span>
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
    </MainLayout>
  )
}

export default ComplaintsPage
