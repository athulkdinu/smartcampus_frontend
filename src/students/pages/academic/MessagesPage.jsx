import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import { MessageSquare, Clock, User, Bell } from 'lucide-react'
import { getInboxAPI } from '../../../services/communicationAPI'
import toast from 'react-hot-toast'

const MessagesPage = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const res = await getInboxAPI()
      if (res?.status === 200) {
        setMessages(res.data.messages || [])
      } else {
        toast.error('Failed to load messages')
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">Academic & Campus</p>
          <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
          <p className="text-slate-600">Messages from Admin and Faculty</p>
        </div>

        {/* Messages List - Notifications Style */}
        <Card className="border border-slate-100 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <Bell className="w-5 h-5 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900">Inbox</h2>
            {messages.length > 0 && (
              <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold">
                {messages.length}
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12 text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50 animate-pulse" />
                <p>Loading messages...</p>
              </div>
            ) : messages.length > 0 ? (
              messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all hover:border-indigo-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            From: {message.from}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {message.role === 'admin' ? 'Admin' : message.role === 'faculty' ? 'Faculty' : message.role}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0 ml-2">
                          <Clock className="w-3 h-3" />
                          {message.timestamp ? new Date(message.timestamp).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      {message.subject && (
                        <p className="text-sm font-medium text-slate-900 mb-1">{message.subject}</p>
                      )}
                      <p className="text-sm text-slate-600 line-clamp-2">{message.message || message.preview}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No messages</p>
                <p className="text-xs mt-1">You'll see messages from Admin and Faculty here</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default MessagesPage
