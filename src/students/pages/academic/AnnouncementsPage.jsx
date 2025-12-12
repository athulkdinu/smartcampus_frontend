import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { Bell, AlertCircle, AlertTriangle, Info, Filter } from 'lucide-react'
import { getStudentAnnouncementsAPI } from '../../../services/announcementAPI'

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'high', 'medium', 'low'
  const [loading, setLoading] = useState(true)

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

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            High Priority
          </span>
        )
      case 'medium':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Medium Priority
          </span>
        )
      case 'low':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Low Priority
          </span>
        )
      default:
        return null
    }
  }

  const filteredAnnouncements = filter === 'all'
    ? announcements
    : announcements.filter(ann => ann.priority === filter)

  return (
    <MainLayout>
      <div className="space-y-8 p-4 md:p-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Announcements</h1>
          <p className="text-lg text-slate-600">Stay updated with important campus announcements</p>
        </div>

        {/* Filter */}
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filter:</span>
            {['all', 'high', 'medium', 'low'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
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
          <div className="grid grid-cols-1 gap-6">
            {filteredAnnouncements.map((announcement) => (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{announcement.title}</h3>
                        {getPriorityBadge(announcement.priority)}
                      </div>
                      <p className="text-sm text-slate-500">
                        Posted by {announcement.createdBy?.name || 'Admin'} • {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                      {announcement.expiresAt && (
                        <p className="text-xs text-slate-400 mt-1">
                          Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{announcement.message}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default AnnouncementsPage

