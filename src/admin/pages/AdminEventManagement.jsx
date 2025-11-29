import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Calendar, CheckCircle2, XCircle, Sparkles, User } from 'lucide-react'
import { eventProposals } from '../../shared/data/workflowData'
import { createEventAPI } from '../../services/api'

const AdminEventManagement = () => {
  const [events, setEvents] = useState(
    eventProposals.filter((event) => event.forwardedToAdmin)
  )
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    section: 'Campus Events',
    facultyInCharge: '',
    submittedBy: 'Admin',
    origin: 'Admin created',
  })

  const { pendingEvents, approvedEvents, rejectedEvents } = useMemo(() => {
    return {
      pendingEvents: events.filter(event => ['pending', 'forwarded'].includes(event.status)),
      approvedEvents: events.filter(event => event.status === 'approved'),
      rejectedEvents: events.filter(event => event.status === 'rejected')
    }
  }, [events])

  const updateEventStatus = (id, status) => {
    setEvents(prev =>
      prev.map(event => (event.id === id ? { ...event, status } : event))
    )
    toast.success(`Event ${status}`)
  }

  const handleAddEvent = async (e) => {
    e.preventDefault()

    if (!newEvent.title.trim() || !newEvent.date || !newEvent.time) {
      toast.error('Title, date and time are required')
      return
    }

    try {
      const payload = {
        title: newEvent.title.trim(),
        description: newEvent.description,
        date: newEvent.date,
        time: newEvent.time,
        location: undefined,
        facultyInCharge: newEvent.facultyInCharge
      }

      const response = await createEventAPI(payload)

      if (response?.status === 201) {
        const created = response.data.event
        const createdEvent = {
          id: created._id,
          title: created.title,
          description: created.description || 'No description provided.',
          date: created.date,
          time: created.time,
          section: created.section || 'Campus Events',
          facultyInCharge: created.facultyInCharge || 'Admin',
          submittedBy: created.submittedByName || 'Admin',
          origin: created.origin || 'Admin created',
          status: created.status || 'approved',
        }

        setEvents(prev => [createdEvent, ...prev])
        toast.success('Event added and published')
        setShowAddForm(false)
        setNewEvent({
          title: '',
          description: '',
          date: '',
          time: '',
          section: 'Campus Events',
          facultyInCharge: '',
          submittedBy: 'Admin',
          origin: 'Admin created',
        })
      } else {
        const message = response?.response?.data?.message || 'Failed to add event'
        toast.error(message)
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Something went wrong'
      toast.error(message)
    }
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
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Faculty forwarded
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                  Pending Event Requests
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <span className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold text-center">
                  {pendingEvents.length} awaiting decision
                </span>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddForm(prev => !prev)}
                >
                  {showAddForm ? 'Close Add Event' : 'Add Event'}
                </Button>
              </div>
            </div>

            {showAddForm && (
              <form
                onSubmit={handleAddEvent}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Event title"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Faculty in charge
                  </label>
                  <input
                    type="text"
                    value={newEvent.facultyInCharge}
                    onChange={e =>
                      setNewEvent({ ...newEvent, facultyInCharge: e.target.value })
                    }
                    placeholder="Faculty name"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={e =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    placeholder="Short description of the event"
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Publish Event
                  </Button>
                </div>
              </form>
            )}
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

