import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Calendar, MapPin, Clock, Sparkles, CheckCircle2, XCircle, Share2 } from 'lucide-react'
import { eventProposals } from '../../shared/data/workflowData'

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-rose-50 text-rose-700',
  forwarded: 'bg-purple-50 text-purple-700'
}

const FacultyEventRequests = () => {
  const [requests, setRequests] = useState(eventProposals)

  const handleAction = (id, action) => {
    setRequests(prev =>
      prev.map(request => {
        if (request.id !== id) return request
        if (action === 'forward') {
          return { ...request, status: 'forwarded', forwardedToAdmin: true }
        }
        return { ...request, status: action }
      })
    )
    toast.success(`Event ${action === 'forward' ? 'forwarded to admin' : `${action}ed`}`)
  }

  return (
    <FacultyLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Campus Life</p>
            <h1 className="text-3xl font-bold text-slate-900">Event Requests</h1>
            <p className="text-slate-600">Approve, reject, or forward student proposals to admin event management.</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 text-sm font-semibold">
            {requests.filter(request => request.status === 'pending').length} awaiting decision
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {requests.map((request, idx) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{request.section}</p>
                    <h3 className="text-xl font-semibold text-slate-900">{request.title}</h3>
                    <p className="text-sm text-slate-500">by {request.submittedBy}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[request.status] || statusStyles.pending}`}>
                    {request.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{request.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{request.date}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{request.time}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{request.location}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-500" />
                    <span>{request.facultyInCharge}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="success" onClick={() => handleAction(request.id, 'approved')}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleAction(request.id, 'rejected')}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700" onClick={() => handleAction(request.id, 'forward')}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Forward to Admin
                  </Button>
                </div>
                {request.forwardedToAdmin && (
                  <p className="text-xs text-purple-600 font-semibold">Forwarded to Admin → Pending Approvals</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </FacultyLayout>
  )
}

export default FacultyEventRequests

