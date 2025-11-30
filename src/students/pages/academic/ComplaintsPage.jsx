import { motion } from 'framer-motion'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Modal from '../../../shared/components/Modal'
import { AlertCircle, Plus, CheckCircle2, Clock, FileText } from 'lucide-react'
import { complaints } from '../../data/academicData'
import { useState } from 'react'

const ComplaintsPage = () => {
  const [showModal, setShowModal] = useState(false)

  const statusConfig = {
    resolved: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', badge: 'bg-green-50 text-green-700' },
    'in-progress': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-50 text-blue-700' },
    pending: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', badge: 'bg-amber-50 text-amber-700' },
    forwarded: { icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50', badge: 'bg-purple-50 text-purple-700' }
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
            <p className="text-slate-600">Raise infrastructure or academic concerns and track resolution</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Raise Complaint
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { label: 'Total', value: complaints.length, color: 'from-slate-500 to-slate-600' },
            { label: 'Resolved', value: complaints.filter(c => c.status === 'resolved').length, color: 'from-green-500 to-green-600' },
            { label: 'In Progress', value: complaints.filter(c => c.status === 'in-progress').length, color: 'from-blue-500 to-blue-600' },
            { label: 'Pending', value: complaints.filter(c => c.status === 'pending').length, color: 'from-amber-500 to-amber-600' },
            { label: 'Forwarded', value: complaints.filter(c => c.status === 'forwarded').length, color: 'from-purple-500 to-purple-600' }
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
        <div className="grid grid-cols-1 gap-6">
          {complaints.map((issue, idx) => {
            const config = statusConfig[issue.status] || statusConfig.pending
            const Icon = config.icon
            return (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
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
                            {issue.category}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${config.badge}`}>
                            {issue.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{issue.title}</h3>
                        <p className="text-sm text-slate-600 mb-3">{issue.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2 text-xs">
                          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                            Assigned to {issue.assignedFaculty}
                          </span>
                          {issue.forwardedToAdmin && (
                            <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                              Forwarded to Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">Submitted on {issue.submittedDate}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* New Complaint Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Raise New Complaint"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option>Infrastructure</option>
                <option>Academic</option>
                <option>Administrative</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
              <input
                type="text"
                placeholder="Enter complaint title"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                rows={4}
                placeholder="Describe your complaint in detail"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Attach Evidence</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="primary" className="flex-1">Submit Complaint</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </MainLayout>
  )
}

export default ComplaintsPage
