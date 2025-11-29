import { motion } from 'framer-motion'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { Bell, CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react'
import { notices } from '../../data/academicData'
import { useState } from 'react'

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all')

  const priorityConfig = {
    high: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-50 text-red-700' },
    medium: { icon: Info, color: 'text-amber-600', bg: 'bg-amber-50', badge: 'bg-amber-50 text-amber-700' },
    low: { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-50 text-blue-700' }
  }

  const filteredNotices = filter === 'all' 
    ? notices 
    : notices.filter(n => n.priority === filter)

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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Notification Center</h1>
            <p className="text-slate-600">All alerts, exam circulars, placement notifications and campus broadcasts</p>
          </div>
          <Button variant="secondary">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total', value: notices.length, color: 'from-slate-500 to-slate-600' },
            { label: 'High Priority', value: notices.filter(n => n.priority === 'high').length, color: 'from-red-500 to-red-600' },
            { label: 'Medium', value: notices.filter(n => n.priority === 'medium').length, color: 'from-amber-500 to-amber-600' },
            { label: 'Low', value: notices.filter(n => n.priority === 'low').length, color: 'from-blue-500 to-blue-600' }
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
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2">
          {['all', 'high', 'medium', 'low'].map((priority) => (
            <button
              key={priority}
              onClick={() => setFilter(priority)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                filter === priority
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {priority}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotices.map((notice, idx) => {
            const config = priorityConfig[notice.priority] || priorityConfig.low
            const Icon = config.icon
            return (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{notice.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
                          {notice.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                          {notice.type}
                        </span>
                        <span className="text-xs text-slate-400">{notice.date}</span>
                      </div>
                      <p className="text-sm text-slate-600">{notice.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {filteredNotices.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No notifications found</p>
            </div>
          </Card>
        )}
      </motion.div>
    </MainLayout>
  )
}

export default NotificationsPage
