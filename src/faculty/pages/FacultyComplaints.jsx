import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { AlertTriangle, Filter, CheckCircle2, XCircle, Share2, ClipboardList } from 'lucide-react'
import { complaintTickets } from '../../shared/data/workflowData'

const severityStyles = {
  high: 'bg-rose-50 text-rose-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-slate-100 text-slate-600'
}

const FacultyComplaints = () => {
  const [tickets, setTickets] = useState(complaintTickets)
  const [activeFilter, setActiveFilter] = useState('pending')

  const handleAction = (id, action) => {
    setTickets(prev =>
      prev.map(ticket => {
        if (ticket.id !== id) return ticket
        if (action === 'resolve') {
          return { ...ticket, status: 'resolved' }
        }
        if (action === 'reject') {
          return { ...ticket, status: 'rejected' }
        }
        if (action === 'forward') {
          return { ...ticket, status: 'forwarded', forwardedToAdmin: true }
        }
        return ticket
      })
    )
    toast.success(`Complaint ${action === 'forward' ? 'forwarded to admin' : `${action}d`}`)
  }

  const filteredTickets = activeFilter === 'all'
    ? tickets
    : tickets.filter(ticket => ticket.status === activeFilter)

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
          <div className="px-4 py-2 rounded-2xl bg-purple-50 text-purple-700 text-sm font-semibold">
            {tickets.filter(ticket => ticket.status === 'pending' || ticket.status === 'in-review').length} open
          </div>
        </div>

        <Card>
          <div className="flex items-center gap-2 flex-wrap">
            {['pending', 'in-review', 'resolved', 'forwarded', 'all'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                  activeFilter === filter
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter.replace('-', ' ')}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          {filteredTickets.map((ticket, idx) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{ticket.studentName} · {ticket.studentId}</p>
                      <p className="text-xs text-slate-500">{ticket.category}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${severityStyles[ticket.priority] || severityStyles.low}`}>
                      {ticket.priority} priority
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-slate-100 text-slate-600">
                      {ticket.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900">{ticket.title}</h3>
                <p className="text-sm text-slate-600">{ticket.text}</p>
                <p className="text-xs text-slate-500">Submitted {ticket.submittedAt}</p>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="success" onClick={() => handleAction(ticket.id, 'resolve')}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Resolve
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleAction(ticket.id, 'reject')}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700" onClick={() => handleAction(ticket.id, 'forward')}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Pass to Admin
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}

          {filteredTickets.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No complaints need attention for this filter.</p>
              </div>
            </Card>
          )}
        </div>
      </motion.div>
    </FacultyLayout>
  )
}

export default FacultyComplaints

