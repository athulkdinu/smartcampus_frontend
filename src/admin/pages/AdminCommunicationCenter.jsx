import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { MessageSquare, Send, Users, Shield } from 'lucide-react'
import { adminMessageCenter } from '../data/adminDemoData'

const broadcastTargets = [
  { value: 'all-students', label: 'All Students' },
  { value: 'all-faculty', label: 'All Faculty' },
  { value: 'all-users', label: 'All Users' }
]

const AdminCommunicationCenter = () => {
  const [inbox, setInbox] = useState(adminMessageCenter.inbox)
  const [history, setHistory] = useState(adminMessageCenter.history)
  const [broadcast, setBroadcast] = useState({ audience: 'all-students', message: '' })
  const [directMessage, setDirectMessage] = useState({ userId: '', message: '' })

  const sendBroadcast = (e) => {
    e.preventDefault()
    if (!broadcast.message.trim()) return toast.error('Enter a broadcast message')
    const entry = {
      id: `HIS-${history.length + 300}`,
      audience: broadcastTargets.find(target => target.value === broadcast.audience)?.label || 'All Users',
      message: broadcast.message,
      sentAt: new Date().toLocaleString()
    }
    setHistory([entry, ...history])
    toast.success('Broadcast sent')
    setBroadcast({ ...broadcast, message: '' })
  }

  const sendDirectMessage = (e) => {
    e.preventDefault()
    if (!directMessage.userId.trim() || !directMessage.message.trim()) return toast.error('Fill in user ID and message')
    toast.success(`Message queued for ${directMessage.userId}`)
    setDirectMessage({ userId: '', message: '' })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-900 text-white p-6 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Communication Center</p>
              <h1 className="text-3xl font-bold mt-1">Broadcast & Conversations</h1>
            </div>
          </div>
          <p className="text-slate-300 mt-3">Admins can broadcast, respond to faculty escalations, and keep a public audit trail.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2 border border-slate-100/10 bg-white/85 backdrop-blur">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Broadcast Composer</h2>
            <form onSubmit={sendBroadcast} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Audience</label>
                  <select
                    value={broadcast.audience}
                    onChange={(e) => setBroadcast({ ...broadcast, audience: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  >
                    {broadcastTargets.map(target => (
                      <option key={target.value} value={target.value}>{target.label}</option>
                    ))}
                  </select>
                </div>
                <FormInput
                  label="Subject / Context"
                  placeholder="e.g., Mid-term timetable release"
                  value={broadcast.subject || ''}
                  onChange={(e) => setBroadcast({ ...broadcast, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  value={broadcast.message}
                  onChange={(e) => setBroadcast({ ...broadcast, message: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Write a concise broadcast..."
                />
              </div>
              <Button type="submit" variant="primary" className="bg-gradient-to-r from-indigo-500 to-sky-500 border-none">
                <Send className="w-4 h-4 mr-2" />
                Send Broadcast
              </Button>
            </form>
          </Card>

          <Card className="border border-slate-100/10 bg-white/85 backdrop-blur">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Direct Message</h2>
            <form onSubmit={sendDirectMessage} className="space-y-3">
              <FormInput label="User ID or Email" value={directMessage.userId} onChange={(e) => setDirectMessage({ ...directMessage, userId: e.target.value })} placeholder="STU-2043 / user@domain" />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea
                  rows={3}
                  value={directMessage.message}
                  onChange={(e) => setDirectMessage({ ...directMessage, message: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <Button type="submit" variant="secondary">
                <Shield className="w-4 h-4 mr-2" />
                Send Secure Message
              </Button>
            </form>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-slate-100 bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Faculty / Student Inbox</p>
                <h2 className="text-xl font-bold text-slate-900">Incoming Messages</h2>
              </div>
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {inbox.map((thread) => (
                <div key={thread.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{thread.from}</p>
                    <span className="text-xs text-slate-500">{thread.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{thread.role}</p>
                  <p className="text-sm text-slate-700">{thread.message}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border border-slate-100 bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Broadcast History</p>
                <h2 className="text-xl font-bold text-slate-900">Sent Messages</h2>
              </div>
              <Send className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{entry.audience}</p>
                    <span className="text-xs text-slate-500">{entry.sentAt}</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-1">{entry.message}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminCommunicationCenter

