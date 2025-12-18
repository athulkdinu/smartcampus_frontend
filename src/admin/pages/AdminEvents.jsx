import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { Calendar, Plus, MapPin, Users, DollarSign, CheckCircle2, XCircle } from 'lucide-react'

const AdminEvents = () => {
  const [events, setEvents] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'Seminar',
    organizer: '',
    startDate: '',
    endDate: '',
    venue: '',
    expectedAttendees: '',
    budget: ''
  })

  const eventTypes = [
    { value: 'Festival', label: 'Festival' },
    { value: 'Seminar', label: 'Seminar' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Competition', label: 'Competition' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Conference', label: 'Conference' }
  ]

  const handleCreateEvent = (e) => {
    e.preventDefault()
    const event = {
      id: `EVT-${Date.now().toString().slice(-3)}`,
      ...newEvent,
      status: 'Pending Approval',
      expectedAttendees: parseInt(newEvent.expectedAttendees) || 0
    }
    setEvents([...events, event])
    toast.success('Event created successfully')
    setShowCreateForm(false)
    setNewEvent({
      title: '',
      type: 'Seminar',
      organizer: '',
      startDate: '',
      endDate: '',
      venue: '',
      expectedAttendees: '',
      budget: ''
    })
  }

  const handleApproveEvent = (id) => {
    setEvents(events.map(evt => 
      evt.id === id ? { ...evt, status: 'Approved' } : evt
    ))
    toast.success('Event approved')
  }

  const handleRejectEvent = (id) => {
    setEvents(events.map(evt => 
      evt.id === id ? { ...evt, status: 'Rejected' } : evt
    ))
    toast.error('Event rejected')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-green-700'
      case 'Pending Approval': return 'bg-amber-50 text-amber-700'
      case 'Active': return 'bg-blue-50 text-blue-700'
      case 'Completed': return 'bg-slate-100 text-slate-600'
      case 'Rejected': return 'bg-rose-50 text-rose-700'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Events Management</p>
            <h1 className="text-3xl font-bold text-slate-900">Manage campus events</h1>
            <p className="text-slate-600">Create, approve, and oversee all campus events</p>
          </div>
          <Button variant="primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {showCreateForm && (
          <Card className="border-2 border-blue-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Event Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Tech Fest 2025"
                  required
                />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Event Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <FormInput
                  label="Organizer"
                  value={newEvent.organizer}
                  onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                  placeholder="Department Name"
                  required
                />
                <FormInput
                  label="Venue"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  placeholder="Main Auditorium"
                  required
                />
                <FormInput
                  label="Start Date"
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                  required
                />
                <FormInput
                  label="End Date"
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                  required
                />
                <FormInput
                  label="Expected Attendees"
                  type="number"
                  value={newEvent.expectedAttendees}
                  onChange={(e) => setNewEvent({ ...newEvent, expectedAttendees: e.target.value })}
                  placeholder="200"
                  required
                />
                <FormInput
                  label="Budget"
                  value={newEvent.budget}
                  onChange={(e) => setNewEvent({ ...newEvent, budget: e.target.value })}
                  placeholder="₹50,000"
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary">Create Event</Button>
                <Button type="button" variant="secondary" onClick={() => setShowCreateForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-slate-500">{event.organizer}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{event.startDate} - {event.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{event.expectedAttendees} attendees</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span>{event.budget}</span>
                  </div>
                </div>

                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg mb-4">
                  {event.type}
                </span>

                {event.status === 'Pending Approval' && (
                  <div className="flex gap-2 mt-4">
                    <Button variant="success" size="sm" className="flex-1" onClick={() => handleApproveEvent(event.id)}>
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleRejectEvent(event.id)}>
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminEvents

