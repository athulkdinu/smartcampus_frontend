import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Calendar, CheckCircle2, XCircle, Sparkles, User } from 'lucide-react'
import { eventProposals } from '../../shared/data/workflowData'

const AdminEventManagement = () => {
  const [events, setEvents] = useState(eventProposals.filter(event => event.forwardedToAdmin))

  const { pendingEvents, approvedEvents, rejectedEvents } = useMemo(() => {
    return {
      pendingEvents: events.filter(event => ['pending', 'forwarded'].includes(event.status)),
      approvedEvents: events.filter(event => event.status === 'approved'),
      rejectedEvents: events.filter(event => event.status === 'rejected')
    }
  }, [events])

  const updateEventStatus = (id, status) => {
    setEvents(prev => prev.map(event => event.id === id ? { ...event, status } : event))
    toast.success(`Event ${status}`)
  }

  const renderEventCard = (event, actions = true) => (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-100 bg-white/80 backdrop-blur p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{event.section}</p>
          <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-slate-100 text-slate-700">
          {event.status}
        </span>
      </div>
      <p className="text-sm text-slate-600">{event.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{event.date} · {event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Sparkles className="w-4 h-4 text-slate-400" />
          <span>{event.facultyInCharge}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <User className="w-4 h-4 text-slate-400" />
          <span>Student lead: {event.submittedBy}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <User className="w-4 h-4 text-slate-400" />
          <span>Origin: {event.origin || '—'}</span>
        </div>
      </div>
      {actions && (
        <div className="flex flex-wrap gap-3 pt-2">
          <Button size="sm" variant="success" onClick={() => updateEventStatus(event.id, 'approved')}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button size="sm" variant="secondary" onClick={() => updateEventStatus(event.id, 'rejected')}>
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      )}
    </motion.div>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-6 border border-white/10">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Event Workflow</p>
          <h1 className="text-3xl font-bold mt-2">Event Management</h1>
          <p className="text-slate-300 mt-2">Requests arrive from faculty once they vet student proposals. Admin takes the final call.</p>
        </div>

        <Card className="border border-slate-100/10 bg-white/80 backdrop-blur">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Faculty forwarded</p>
              <h2 className="text-2xl font-bold text-slate-900">Pending Event Requests</h2>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold">
              {pendingEvents.length} awaiting decision
            </span>
          </div>
          <div className="space-y-4">
            {pendingEvents.length === 0 && (
              <div className="text-center py-12 text-slate-500">Nothing pending. All forwarded requests addressed.</div>
            )}
            {pendingEvents.map((event) => renderEventCard(event))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-emerald-100 bg-emerald-50/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-600">Approved</p>
                <h3 className="text-xl font-bold text-emerald-900">Published Events</h3>
              </div>
              <span className="text-sm text-emerald-700 font-semibold">{approvedEvents.length}</span>
            </div>
            <div className="space-y-3">
              {approvedEvents.map((event) => renderEventCard(event, false))}
              {approvedEvents.length === 0 && <p className="text-sm text-emerald-700/70">No records yet.</p>}
            </div>
          </Card>

          <Card className="border border-rose-100 bg-rose-50/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-rose-600">Rejected</p>
                <h3 className="text-xl font-bold text-rose-900">Request History</h3>
              </div>
              <span className="text-sm text-rose-700 font-semibold">{rejectedEvents.length}</span>
            </div>
            <div className="space-y-3">
              {rejectedEvents.map((event) => renderEventCard(event, false))}
              {rejectedEvents.length === 0 && <p className="text-sm text-rose-700/70">No records yet.</p>}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminEventManagement

