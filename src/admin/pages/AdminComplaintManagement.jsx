import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import { AlertTriangle, CheckCircle2, XCircle, MessageSquare } from 'lucide-react'
import { complaintTickets } from '../../shared/data/workflowData'

const AdminComplaintManagement = () => {
  const [complaints, setComplaints] = useState(complaintTickets.filter(ticket => ticket.forwardedToAdmin))
  const [commentModal, setCommentModal] = useState({ open: false, ticketId: null, text: '' })

  const activeComplaints = complaints.filter(ticket => ['forwarded', 'pending', 'in-review'].includes(ticket.status))
  const resolvedComplaints = complaints.filter(ticket => ticket.status === 'resolved')

  const updateStatus = (id, status) => {
    setComplaints(prev => prev.map(ticket => ticket.id === id ? { ...ticket, status } : ticket))
    toast.success(`Complaint ${status}`)
  }

  const openCommentModal = (ticketId) => {
    setCommentModal({ open: true, ticketId, text: '' })
  }

  const submitComment = () => {
    toast.success('Comment added to ticket')
    setCommentModal({ open: false, ticketId: null, text: '' })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-rose-900 text-white p-6 border border-white/10">
          <p className="text-xs uppercase tracking-[0.35em] text-rose-200">Escalation Center</p>
          <h1 className="text-3xl font-bold mt-2">Complaint Management</h1>
          <p className="text-slate-200 mt-2">Only faculty-forwarded issues land here. Admin owns the final decision and closes the loop.</p>
        </div>

        <Card className="border border-slate-100/10 bg-white/85 backdrop-blur">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Forwarded by faculty</p>
              <h2 className="text-2xl font-bold text-slate-900">Open Complaints</h2>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-rose-50 text-rose-700 text-sm font-semibold">{activeComplaints.length} awaiting action</span>
          </div>
          <div className="space-y-4">
            {activeComplaints.length === 0 && <p className="text-center text-slate-500 py-12">No open complaints.</p>}
            {activeComplaints.map((ticket) => (
              <motion.div key={ticket.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">{ticket.department} · {ticket.section}</p>
                        <h3 className="text-xl font-semibold text-slate-900">{ticket.title}</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-slate-200 text-slate-800">{ticket.status}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">{ticket.text}</p>
                    <div className="text-xs text-slate-500 mt-2 flex flex-wrap gap-3">
                      <span>Raised by {ticket.studentName}</span>
                      <span>Forwarded by {ticket.assignedFaculty}</span>
                      <span>Category: {ticket.category}</span>
                      <span>Priority: {ticket.priority}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="success" onClick={() => updateStatus(ticket.id, 'resolved')}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Resolve
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => updateStatus(ticket.id, 'rejected')}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-700" onClick={() => openCommentModal(ticket.id)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="border border-emerald-100 bg-emerald-50/70">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-600">Closed Loop</p>
              <h2 className="text-xl font-bold text-emerald-900">Resolved Complaints</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-white text-emerald-700 text-sm font-semibold">{resolvedComplaints.length}</span>
          </div>
          <div className="space-y-3">
            {resolvedComplaints.map((ticket) => (
              <div key={ticket.id} className="p-4 rounded-2xl border border-emerald-100 bg-white/80">
                <p className="text-sm font-semibold text-emerald-900">{ticket.title}</p>
                <p className="text-xs text-emerald-700 mt-1">Resolved from {ticket.department} · {ticket.section}</p>
              </div>
            ))}
            {resolvedComplaints.length === 0 && <p className="text-emerald-700/70 text-sm">No complaints resolved yet.</p>}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={commentModal.open}
        onClose={() => setCommentModal({ open: false, ticketId: null, text: '' })}
        title="Add Comment"
        size="md"
      >
        <div className="space-y-4">
          <textarea
            rows={4}
            value={commentModal.text}
            onChange={(e) => setCommentModal({ ...commentModal, text: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Share internal notes or follow-up steps..."
          />
          <div className="flex gap-3">
            <Button variant="primary" onClick={submitComment}>Save Comment</Button>
            <Button variant="secondary" onClick={() => setCommentModal({ open: false, ticketId: null, text: '' })}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  )
}

export default AdminComplaintManagement

