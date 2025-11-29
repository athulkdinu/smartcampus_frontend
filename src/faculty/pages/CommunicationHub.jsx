import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { MessageSquare, Send, Users, PlusCircle } from 'lucide-react'
import { communicationThreads } from '../data/facultyDemoData'
import { getActiveFacultyProfile } from '../utils/getActiveFaculty'

const CommunicationHub = () => {
  const selectedFaculty = useMemo(() => getActiveFacultyProfile(), [])
  const [composer, setComposer] = useState({
    audience: 'All Sections',
    message: ''
  })

  const handleBroadcast = (e) => {
    e.preventDefault()
    if (!composer.message.trim()) {
      toast.error('Write a short announcement first')
      return
    }
    toast.success(`Message sent to ${composer.audience}`)
    setComposer({ ...composer, message: '' })
  }

  return (
    <FacultyLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Communication</p>
            <h1 className="text-3xl font-bold text-slate-900">Broadcast updates & respond faster</h1>
            <p className="text-slate-600">Centralized messaging across all sections handled by {selectedFaculty.name}.</p>
          </div>
          <Button variant="primary">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Active Threads</h2>
              <span className="text-sm text-slate-500">{communicationThreads.length} live</span>
            </div>
            <div className="space-y-4">
              {communicationThreads.map((thread, idx) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 rounded-2xl border border-slate-200 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{thread.title}</h3>
                      <p className="text-sm text-slate-500">{thread.audience}</p>
                    </div>
                    {thread.unread > 0 && (
                      <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold">
                        {thread.unread} unread
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{thread.lastMessage}</p>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" />
                    Updated {thread.lastActivity}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Send Announcement</h2>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <FormInput
                label="Audience"
                value={composer.audience}
                onChange={(e) => setComposer({ ...composer, audience: e.target.value })}
              />
              <label className="block text-sm font-semibold text-slate-700">
                Message
              </label>
              <textarea
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows={4}
                value={composer.message}
                onChange={(e) => setComposer({ ...composer, message: e.target.value })}
                placeholder="Share reminders, resources, or alerts..."
              />
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Broadcast
              </Button>
            </form>
            <div className="mt-6 rounded-2xl border border-dashed border-blue-200 p-4 flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-slate-600">
                Students receive messages inside the mobile app and by email instantly.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </FacultyLayout>
  )
}

export default CommunicationHub

