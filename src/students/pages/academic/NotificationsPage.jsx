import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { Bell, AlertCircle, AlertTriangle, Info, Filter } from 'lucide-react'
import { getStudentAnnouncementsAPI } from '../../../services/announcementAPI'

const NotificationsPage = () => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'high', 'medium', 'low'

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    try {
      setLoading(true)
      const res = await getStudentAnnouncementsAPI()
      if (res?.status === 200) {
        setAnnouncements(res.data.announcements || [])
      } else {
        toast.error('Failed to load announcements')
      }
    } catch (error) {
      console.error('Error loading announcements:', error)
      toast.error('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  const priorityConfig = {
    high: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700 border-red-200' },
    medium: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    low: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700 border-blue-200' }
  }

  const filteredAnnouncements = filter === 'all'
    ? announcements
    : announcements.filter(ann => ann.priority === filter)

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 p-4 md:p-6"
      >
        {/* Page Header */}
        <div className="mb-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500 mb-2">Academic & Campus</p>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Notification Center</h1>
            <p className="text-lg text-slate-600">All alerts, announcements, and campus broadcasts</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total', value: announcements.length, color: 'from-slate-500 to-slate-600' },
            { label: 'High Priority', value: announcements.filter(n => n.priority === 'high').length, color: 'from-red-500 to-red-600' },
            { label: 'Medium', value: announcements.filter(n => n.priority === 'medium').length, color: 'from-yellow-500 to-yellow-600' },
            { label: 'Low', value: announcements.filter(n => n.priority === 'low').length, color: 'from-blue-500 to-blue-600' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <Bell className="w-7 h-7 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filter:</span>
            {['all', 'high', 'medium', 'low'].map((priority) => (
              <button
                key={priority}
                onClick={() => setFilter(priority)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === priority
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </Card>

        {/* Announcements List */}
        {loading ? (
          <Card className="p-12 text-center">
            <div className="text-slate-500">Loading announcements...</div>
          </Card>
        ) : filteredAnnouncements.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No announcements found</h3>
            <p className="text-slate-500">
              {filter === 'all' 
                ? 'No announcements available at the moment'
                : `No ${filter} priority announcements found`}
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredAnnouncements.map((announcement, idx) => {
              const config = priorityConfig[announcement.priority] || priorityConfig.low
              const Icon = config.icon
              return (
                <motion.div
                  key={announcement._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${config.badge.split(' ')[0]} border-opacity-50`}>
                        <Icon className={`w-7 h-7 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{announcement.title}</h3>
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.badge}`}>
                                {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                              </span>
                              <span className="text-xs text-slate-400">
                                {new Date(announcement.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{announcement.message}</p>
                        </div>
                        <div className="flex items-center gap-4 pt-3 border-t border-slate-200">
                          <div className="text-xs text-slate-500">
                            <span className="font-medium">Posted by:</span> {announcement.createdBy?.name || 'Admin'}
                            {announcement.createdBy?.role && (
                              <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                                {announcement.createdBy.role}
                              </span>
                            )}
                          </div>
                          {announcement.expiresAt && (
                            <div className="text-xs text-slate-400">
                              Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
                            </div>
                          )}
                          {announcement.classes && announcement.classes.length > 0 && (
                            <div className="text-xs text-slate-500">
                              <span className="font-medium">For:</span> {announcement.classes.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </MainLayout>
  )
}

export default NotificationsPage
