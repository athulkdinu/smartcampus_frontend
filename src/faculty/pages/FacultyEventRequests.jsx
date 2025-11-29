import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Calendar, MapPin, Clock, Sparkles, CheckCircle2, XCircle, Share2 } from 'lucide-react'
import { eventProposals as demoEventProposals } from '../../shared/data/workflowData'
import { createEventAPI, getFacultyRequestsAPI, updateEventStatusAPI } from '../../services/api'

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-rose-50 text-rose-700',
  forwarded: 'bg-purple-50 text-purple-700'
}

const FacultyEventRequests = () => {
  const [requests, setRequests] = useState([])
  const [creating, setCreating] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    facultyInCharge: '',
  })

  const handleAction = async (id, action) => {
    try {
      const response = await updateEventStatusAPI(id, action)
      if (response?.status === 200) {
        setRequests(prev =>
          prev.map(request => {
            if (request.id !== id && request._id !== id) return request
            if (action === 'forward') {
              return { ...request, status: 'forwarded', forwardedToAdmin: true }
            }
            return { ...request, status: action }
          })
        )
        toast.success(`Event ${action === 'forward' ? 'forwarded to admin' : `${action}ed`}`)
      } else {
        const message = response?.response?.data?.message || 'Update failed'
        toast.error(message)
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Something went wrong'
      toast.error(message)
    }
  }

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await getFacultyRequestsAPI()
        if (res?.status === 200) {
          const backend = (res.data.events || []).map(ev => ({
            id: ev._id,
            title: ev.title,
            description: ev.description,
            date: ev.date,
            time: ev.time,
            location: ev.location,
            facultyInCharge: ev.facultyInCharge,
            status: ev.status,
            section: ev.section,
            submittedBy: ev.submittedByName,
            forwardedToAdmin: ev.forwardedToAdmin,
          }))
          setRequests(backend)
        } else {
          setRequests(demoEventProposals)
        }
      } catch {
        setRequests(demoEventProposals)
      }
    }
    loadRequests()
  }, [])

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
            <p className="text-slate-600">Approve, reject, or forward student proposals to admin event management, or publish a new faculty-initiated event.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 text-sm font-semibold">
              {requests.filter(request => request.status === 'pending').length} awaiting decision
            </div>
            <button
              type="button"
              onClick={() => setCreating(prev => !prev)}
              className="px-4 py-2 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              {creating ? 'Close Create Event' : 'Create Event'}
            </button>
          </div>
        </div>

        {creating && (
          <div className="mb-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">Create Faculty Event</h2>
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={async (e) => {
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
                      location: newEvent.location,
                      facultyInCharge: newEvent.facultyInCharge,
                      origin: 'Faculty initiated',
                    }
                    const response = await createEventAPI(payload)
                    if (response?.status === 201) {
                      toast.success('Event created and sent to admin')
                      setNewEvent({
                        title: '',
                        description: '',
                        date: '',
                        time: '',
                        location: '',
                        facultyInCharge: '',
                      })
                      setCreating(false)
                    } else {
                      const message = response?.response?.data?.message || 'Failed to create event'
                      toast.error(message)
                    }
                  } catch (error) {
                    const message = error?.response?.data?.message || 'Something went wrong'
                    toast.error(message)
                  }
                }}
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Event title"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Faculty In-Charge</label>
                  <input
                    type="text"
                    value={newEvent.facultyInCharge}
                    onChange={e => setNewEvent({ ...newEvent, facultyInCharge: e.target.value })}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Lab, auditorium..."
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={3}
                    placeholder="Short description of the event"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setCreating(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                  >
                    Submit Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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

