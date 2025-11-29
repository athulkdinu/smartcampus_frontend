import { motion } from 'framer-motion'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { MessageSquare, User, Clock, Reply } from 'lucide-react'
import { communications } from '../../data/academicData'

const MessagesPage = () => {
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages & Communication</h1>
            <p className="text-slate-600">Mentor conversations, class group announcements and faculty updates</p>
          </div>
          <Button variant="primary">
            <MessageSquare className="w-4 h-4 mr-2" />
            Open Inbox
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Messages', value: communications.length, color: 'from-blue-500 to-blue-600' },
            { label: 'Unread', value: communications.length, color: 'from-amber-500 to-amber-600' },
            { label: 'From Faculty', value: communications.filter(c => c.role.includes('Faculty')).length, color: 'from-purple-500 to-purple-600' }
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
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communications.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {message.sender.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{message.sender}</p>
                      <p className="text-xs text-slate-500">{message.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {message.time}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-3">{message.message}</p>

                <Button variant="ghost" size="sm" className="w-full">
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </MainLayout>
  )
}

export default MessagesPage
