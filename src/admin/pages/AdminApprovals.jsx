import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { CheckCircle2, XCircle, Calendar, Building2, Users, ArrowRight, AlertTriangle } from 'lucide-react'
import { pendingApprovals } from '../data/adminDemoData'

const AdminApprovals = () => {
  const navigate = useNavigate()
  const [approvals, setApprovals] = useState(pendingApprovals)

  const getTypeIcon = (type) => {
    switch (type) {
      case 'event': return Calendar
      case 'resource': return Building2
      case 'user': return Users
      case 'complaint': return AlertTriangle
      default: return Calendar
    }
  }

  const handleReview = (approval) => {
    // Redirect to appropriate module based on type
    if (approval.type === 'event') {
      navigate('/admin/events')
    } else if (approval.type === 'resource') {
      navigate('/admin/campus')
    } else if (approval.type === 'user') {
      navigate('/admin/users')
    } else if (approval.type === 'complaint') {
      toast.info('Notified campus operations team')
      return
    }
    toast.info(`Redirecting to ${approval.type} management`)
  }

  const handleApprove = (id) => {
    setApprovals(approvals.filter(app => app.id !== id))
    toast.success('Approval granted')
  }

  const handleReject = (id) => {
    setApprovals(approvals.filter(app => app.id !== id))
    toast.error('Request rejected')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Approvals</p>
            <h1 className="text-3xl font-bold text-slate-900">Pending approval requests</h1>
            <p className="text-slate-600">Review and approve requests from students, faculty, and departments</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-amber-50 text-amber-700 text-sm font-semibold">
            {approvals.length} pending
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">High Priority</p>
                <p className="text-2xl font-bold text-slate-900">
                  {approvals.filter(a => a.priority === 'high').length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Medium Priority</p>
                <p className="text-2xl font-bold text-slate-900">
                  {approvals.filter(a => a.priority === 'medium').length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Requests</p>
                <p className="text-2xl font-bold text-slate-900">{approvals.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {approvals.map((approval, idx) => {
            const TypeIcon = getTypeIcon(approval.type)
            return (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`border-l-4 ${
                  approval.priority === 'high' ? 'border-red-500' : 'border-amber-500'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            approval.priority === 'high' ? 'bg-red-50' : 'bg-amber-50'
                          }`}>
                            <TypeIcon className={`w-5 h-5 ${
                              approval.priority === 'high' ? 'text-red-600' : 'text-amber-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">{approval.title}</h3>
                            <p className="text-sm text-slate-600">{approval.description}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          approval.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {approval.priority} priority
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 rounded-xl">
                        {Object.entries(approval.details).slice(0, 4).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-sm font-semibold text-slate-900">{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>Requested by: <strong className="text-slate-700">{approval.requestedBy}</strong></span>
                        <span>•</span>
                        <span>{approval.date}</span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg capitalize">
                          {approval.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:min-w-[200px]">
                      <Button variant="primary" size="sm" onClick={() => handleReview(approval)}>
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                      <Button variant="success" size="sm" onClick={() => handleApprove(approval.id)}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleReject(approval.id)}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}

          {approvals.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">All caught up!</h3>
                <p className="text-slate-600">No pending approval requests</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminApprovals

