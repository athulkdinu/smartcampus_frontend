import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { Calendar, MapPin, Clock, Sparkles, ArrowRight } from 'lucide-react'
import { events as demoEvents, studentEventProposals as demoProposals, studentProfile } from '../../data/academicData'
import { createEventAPI, getStudentApprovedEventsAPI, getStudentProposalsAPI } from '../../../services/api'

const EventsPage = () => {
  const typeColors = {
    festival: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    career: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    lecture: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
  }

  const [approvedEvents, setApprovedEvents] = useState([])
  const [proposals, setProposals] = useState([])
  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    facultyInCharge: studentProfile.facultyMentor
  })

  const proposalStatusStyles = {
    pending: 'bg-amber-50 text-amber-700',
    approved: 'bg-green-50 text-green-700',
    rejected: 'bg-rose-50 text-rose-700',
    forwarded: 'bg-purple-50 text-purple-700'
  }

  const handleProposalSubmit = async (e) => {
    e.preventDefault()
    if (!proposalForm.title.trim() || !proposalForm.date) {
      toast.error('Title and date are required')
      return
    }

    try {
      const payload = {
        title: proposalForm.title.trim(),
        description: proposalForm.description,
        date: proposalForm.date,
        time: proposalForm.time,
        location: proposalForm.location,
        facultyInCharge: proposalForm.facultyInCharge
      }

      const response = await createEventAPI(payload)

      if (response?.status === 201) {
        const newProposal = {
          id: response.data.event._id,
          ...proposalForm,
          status: 'pending',
          submittedBy: studentProfile.name,
          studentId: studentProfile.id,
          submittedAt: new Date().toISOString().split('T')[0],
          section: studentProfile.section,
          forwardedToAdmin: false
        }
        setProposals([newProposal, ...proposals])
        toast.success('Event proposal submitted')
        setProposalForm({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          facultyInCharge: studentProfile.facultyMentor
        })
      } else {
        const message = response?.response?.data?.message || 'Failed to submit proposal'
        toast.error(message)
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Something went wrong'
      toast.error(message)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [approvedRes, proposalsRes] = await Promise.all([
          getStudentApprovedEventsAPI(),
          getStudentProposalsAPI()
        ])

        if (approvedRes?.status === 200) {
          setApprovedEvents(approvedRes.data.events || [])
        } else {
          setApprovedEvents(demoEvents)
        }

        if (proposalsRes?.status === 200) {
          // map backend events to proposal card shape
          const backendProposals = (proposalsRes.data.events || []).map(ev => ({
            id: ev._id,
            title: ev.title,
            description: ev.description,
            date: ev.date,
            time: ev.time,
            location: ev.location,
            facultyInCharge: ev.facultyInCharge,
            status: ev.status,
            submittedAt: ev.createdAt?.slice(0, 10) || new Date().toISOString().split('T')[0],
            section: ev.section || studentProfile.section
          }))
          setProposals(backendProposals)
        } else {
          setProposals(demoProposals)
        }
      } catch {
        setApprovedEvents(demoEvents)
        setProposals(demoProposals)
      }
    }

    loadData()
  }, [])

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
            <h1 className="text-3xl font-bold text-slate-900">Events & Activities</h1>
            <p className="text-slate-600">Stay updated with workshops, hackathons, fests and placement sessions</p>
          </div>
          <Button variant="secondary">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Events', value: approvedEvents.length, color: 'from-purple-500 to-purple-600' },
            { label: 'Upcoming', value: approvedEvents.length, color: 'from-blue-500 to-blue-600' },
            { label: 'This Month', value: approvedEvents.filter(e => e.date?.includes('2024')).length, color: 'from-indigo-500 to-indigo-600' }
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
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approvedEvents.map((event, idx) => {
            const colors = typeColors[event.type] || typeColors.lecture
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${colors.bg} ${colors.text}`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{event.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 flex-1">{event.description}</p>

                  <div className="space-y-2 mb-4 p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span><strong className="text-slate-900">Date:</strong> {event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span><strong className="text-slate-900">Time:</strong> {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span><strong className="text-slate-900">Location:</strong> {event.location}</span>
                    </div>
                  </div>

                  <Button variant="ghost" className="w-full">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Event Proposal Request */}
        <Card>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Student → Faculty → Admin</p>
              <h2 className="text-2xl font-bold text-slate-900">Event Proposal Request</h2>
              <p className="text-slate-600 text-sm">Submit new ideas, assign a faculty in-charge, and track escalation to admin.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
              {proposals.length} proposals
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleProposalSubmit} className="space-y-4">
              {[
                { label: 'Event Title', name: 'title', type: 'text', placeholder: 'e.g., AI Hack Night' },
                { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Brief overview & impact' }
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={proposalForm[field.name]}
                      onChange={(e) => setProposalForm({ ...proposalForm, [field.name]: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type="text"
                      value={proposalForm[field.name]}
                      onChange={(e) => setProposalForm({ ...proposalForm, [field.name]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={proposalForm.date}
                    onChange={(e) => setProposalForm({ ...proposalForm, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={proposalForm.time}
                    onChange={(e) => setProposalForm({ ...proposalForm, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  value={proposalForm.location}
                  onChange={(e) => setProposalForm({ ...proposalForm, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Innovation Lab, Think Tank Room..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Faculty In-Charge</label>
                <input
                  type="text"
                  value={proposalForm.facultyInCharge}
                  onChange={(e) => setProposalForm({ ...proposalForm, facultyInCharge: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Submit Proposal
              </Button>
            </form>

            <div className="space-y-4">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-slate-500">{proposal.section}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{proposal.title}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${proposalStatusStyles[proposal.status] || 'bg-slate-100 text-slate-600'}`}>
                      {proposal.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-3">{proposal.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{proposal.date || 'TBC'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{proposal.time || '--'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{proposal.location || 'To be decided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      <span>{proposal.facultyInCharge}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Submitted on {proposal.submittedAt}</span>
                    {proposal.status === 'forwarded' && (
                      <span className="text-purple-600 font-semibold">Forwarded to Admin</span>
                    )}
                  </div>
                </div>
              ))}
              {proposals.length === 0 && (
                <div className="p-6 rounded-2xl border border-dashed border-slate-200 text-center text-slate-500 text-sm">
                  No proposals yet. Submit one to get faculty review.
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default EventsPage
