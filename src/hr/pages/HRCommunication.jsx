import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { MessageSquare, Send, Inbox, Mail, Clock, User } from 'lucide-react'
import { getAllUsersAPI } from '../../services/api'
import { sendMessageAPI, getInboxAPI, getSentAPI } from '../../services/communicationAPI'

const HRCommunication = () => {
  const [activeTab, setActiveTab] = useState('inbox')
  const [inbox, setInbox] = useState([])
  const [sent, setSent] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [adminUsers, setAdminUsers] = useState([])
  
  const [message, setMessage] = useState({
    adminId: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    loadAdminUsers()
    loadMessages()
  }, [])

  useEffect(() => {
    if (activeTab === 'inbox') {
      loadInbox()
    } else if (activeTab === 'sent') {
      loadSent()
    }
  }, [activeTab])

  const loadAdminUsers = async () => {
    try {
      const res = await getAllUsersAPI()
      if (res?.status === 200) {
        const admins = (res.data.users || []).filter(user => user.role === 'admin')
        setAdminUsers(admins)
        // Auto-select first admin if available
        if (admins.length > 0 && !message.adminId) {
          setMessage(prev => ({ ...prev, adminId: admins[0].id }))
        }
      }
    } catch (error) {
      console.error('Error loading admin users:', error)
    }
  }

  const loadMessages = () => {
    loadInbox()
    loadSent()
  }

  const loadInbox = async () => {
    try {
      setLoadingMessages(true)
      const res = await getInboxAPI()
      if (res?.status === 200) {
        setInbox(res.data.messages || [])
      } else {
        toast.error('Failed to load inbox')
      }
    } catch (error) {
      console.error('Error loading inbox:', error)
      toast.error('Failed to load inbox')
    } finally {
      setLoadingMessages(false)
    }
  }

  const loadSent = async () => {
    try {
      setLoadingMessages(true)
      const res = await getSentAPI()
      if (res?.status === 200) {
        setSent(res.data.messages || [])
      } else {
        toast.error('Failed to load sent messages')
      }
    } catch (error) {
      console.error('Error loading sent messages:', error)
      toast.error('Failed to load sent messages')
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.message.trim()) {
      toast.error('Please enter a message')
      return
    }
    if (!message.subject.trim()) {
      toast.error('Please enter a subject')
      return
    }
    if (!message.adminId) {
      toast.error('Please select an admin')
      return
    }
    
    try {
      const payload = {
        subject: message.subject,
        body: message.message,
        mode: 'user',
        targetUserId: message.adminId
      }

      const res = await sendMessageAPI(payload)
      if (res?.status === 201) {
        toast.success('Message sent to Admin successfully')
        setMessage({ adminId: adminUsers[0]?.id || '', subject: '', message: '' })
        loadSent()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(error?.response?.data?.message || 'Failed to send message')
    }
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-900 text-white p-6 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Communication</p>
              <h1 className="text-3xl font-bold mt-1">Messages</h1>
            </div>
          </div>
          <p className="text-slate-300 mt-3">Send messages to Admin and view your inbox.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Message Composer */}
          <div className="xl:col-span-1">
            <Card className="border border-slate-100 bg-white/80 backdrop-blur">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Send Message to Admin</h2>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Admin</label>
                  <select
                    value={message.adminId}
                    onChange={(e) => setMessage({ ...message, adminId: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  >
                    <option value="">Select an admin</option>
                    {adminUsers.map(admin => (
                      <option key={admin.id} value={admin.id}>{admin.name} ({admin.email})</option>
                    ))}
                  </select>
                </div>

                <FormInput
                  label="Subject"
                  placeholder="Message subject"
                  value={message.subject}
                  onChange={(e) => setMessage({ ...message, subject: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea
                    rows={5}
                    value={message.message}
                    onChange={(e) => setMessage({ ...message, message: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Write your message to Admin..."
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 border-none">
                  <Send className="w-4 h-4 mr-2" />
                  Send to Admin
                </Button>
              </form>
            </Card>
          </div>

          {/* Right: Message Lists */}
          <div className="xl:col-span-2">
            <Card className="border border-slate-100 bg-white/80 backdrop-blur">
              <div className="flex items-center gap-4 mb-6 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
                    activeTab === 'inbox'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  Inbox
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
                    activeTab === 'sent'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Sent
                </button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {activeTab === 'inbox' ? (
                  inbox.length > 0 ? (
                    inbox.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{msg.from}</p>
                              <p className="text-xs text-slate-500">{msg.role || 'Admin'}</p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {msg.timestamp}
                          </span>
                        </div>
                        {msg.subject && (
                          <p className="text-sm font-medium text-slate-900 mb-1">{msg.subject}</p>
                        )}
                        <p className="text-sm text-slate-600 line-clamp-2">{msg.preview || msg.message}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No messages in inbox</p>
                    </div>
                  )
                ) : (
                  sent.length > 0 ? (
                    sent.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">To: {msg.to || 'Admin'}</p>
                          </div>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {msg.timestamp}
                          </span>
                        </div>
                        {msg.subject && (
                          <p className="text-sm font-medium text-slate-900 mb-1">{msg.subject}</p>
                        )}
                        <p className="text-sm text-slate-600 line-clamp-2">{msg.preview || msg.message}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No sent messages</p>
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </HRLayout>
  )
}

export default HRCommunication

