import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMemo, useState, useEffect } from 'react'
import { ArrowRight, Calendar, BookOpen, Bell, TrendingUp, Video, FileText } from 'lucide-react'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { getInboxAPI } from '../../services/communicationAPI'
import { getStudentLecturesAPI } from '../../services/lectureAPI'
import { getStudentAnnouncementsAPI } from '../../services/announcementAPI'

const AcademicCampus = () => {
  const navigate = useNavigate()
  const [lectureMaterials, setLectureMaterials] = useState([])
  const [loadingLectures, setLoadingLectures] = useState(true)
  const [communications, setCommunications] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)

  useEffect(() => {
    loadLectureMaterials()
    loadMessages()
    loadAnnouncements()
  }, [])

  const loadMessages = async () => {
    try {
      const res = await getInboxAPI()
      if (res?.status === 200) {
        setCommunications((res.data.messages || []).slice(0, 3))
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const loadLectureMaterials = async () => {
    try {
      setLoadingLectures(true)
      const res = await getStudentLecturesAPI()
      if (res?.status === 200) {
        setLectureMaterials(res.data.lectureMaterials || [])
      }
    } catch (error) {
      console.error('Error loading lecture materials:', error)
    } finally {
      setLoadingLectures(false)
    }
  }

  const loadAnnouncements = async () => {
    try {
      setLoadingAnnouncements(true)
      const res = await getStudentAnnouncementsAPI()
      if (res?.status === 200) {
        setAnnouncements((res.data.announcements || []).slice(0, 3)) // Show latest 3
      }
    } catch (error) {
      console.error('Error loading announcements:', error)
    } finally {
      setLoadingAnnouncements(false)
    }
  }

  // Since academic stats now come only from backend-driven pages,
  // show neutral placeholders here instead of static demo data.
  const quickStats = [
    {
      title: 'Grade Snapshot',
      metric: '—',
      meta: 'Connects to your latest grade records',
      trend: '',
      path: '/student/academic/grades',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Attendance Health',
      metric: '—',
      meta: 'Shows once attendance records are available',
      trend: '',
      path: '/student/academic/attendance',
      icon: Calendar,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Assignments Due',
      metric: '—',
      meta: 'Pending submissions summary from assignments',
      trend: '',
      path: '/student/academic/assignments',
      icon: BookOpen,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const serviceCards = [
    { title: 'Academic Grades', description: 'Subject-wise breakdown & transcripts.', stat: 'Opens grades page', path: '/student/academic/grades', icon: TrendingUp },
    { title: 'Attendance Insights', description: 'Daily tracker, warnings & trends.', stat: 'Opens attendance page', path: '/student/academic/attendance', icon: Calendar },
    { title: 'Assignments Board', description: 'Submissions, feedback & timers.', stat: 'Opens assignments page', path: '/student/academic/assignments', icon: BookOpen },
    { title: 'Announcements', description: 'Campus updates & important notices.', stat: 'Latest updates', path: '/student/academic/announcements', icon: Bell },
    { title: 'Leave Portal', description: 'Apply, upload proofs & track approvals.', stat: 'Leave history', path: '/student/academic/leave', icon: Calendar },
    { title: 'Exam Hub', description: 'Schedules, seating & hall tickets.', stat: 'Exam schedules', path: '/student/academic/exams', icon: BookOpen },
    { title: 'Complaints Desk', description: 'Raise infra/service concerns.', stat: 'Your complaints', path: '/student/academic/complaints', icon: Bell }
  ]

  // Get first 4 lecture materials for highlights
  const lectureHighlights = lectureMaterials.slice(0, 4)

  const handleNavigate = (path) => navigate(path)

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 p-4 md:p-6"
      >
        {/* Page Header with Colors */}
        <div className="mb-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-400 to-pink-400 rounded-2xl p-8 md:p-10 text-white shadow-xl">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.3),_transparent_60%)]"></div>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.2),_transparent_50%)]"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.2em] text-indigo-100 font-semibold">Academic & Campus</p>
                  <h1 className="text-4xl md:text-5xl font-bold text-white">Academic & Campus</h1>
                  <p className="text-lg text-indigo-50 max-w-2xl">
                    A comprehensive information surface that highlights classes, attention areas, notifications and navigation into every academic tool.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/student/dashboard')}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                  >
                    Back to dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages & Communications */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Mailbox</p>
              <h2 className="text-xl font-bold text-slate-900">Mentors & Faculty</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleNavigate('/student/academic/messages')}>
              View all
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communications.length > 0 ? (
              communications.map((message) => (
                <div key={message.id} className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{message.from}</p>
                      <p className="text-xs text-slate-500">{message.role}</p>
                    </div>
                    <span className="text-xs text-slate-400">
                      {message.timestamp ? new Date(message.timestamp).toLocaleDateString() : ''}
                    </span>
                  </div>
                  {message.subject && (
                    <p className="text-sm font-medium text-slate-700 mb-2">{message.subject}</p>
                  )}
                  <p className="text-sm text-slate-600 line-clamp-3">{message.preview || message.body || message.message}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-slate-400 text-sm">
                No messages
              </div>
            )}
          </div>
        </Card>

        {/* Lecture Highlights & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Learning Resources</p>
                <h2 className="text-xl font-bold text-slate-900">Lecture Highlights</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleNavigate('/student/academic/lectures')}>
                Show more
              </Button>
            </div>
            {loadingLectures ? (
              <div className="text-center py-8">
                <p className="text-sm text-slate-500">Loading lecture materials...</p>
              </div>
            ) : lectureHighlights.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No lecture materials available yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lectureHighlights.map((material) => {
                  const hasVideo = !!material.videoUrl
                  const hasFile = !!material.fileUrl
                  const materialType = hasVideo ? 'video' : hasFile ? 'file' : 'text'
                  
                  return (
                    <div
                      key={material._id || material.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-5 hover:bg-white hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleNavigate('/student/academic/lectures')}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span className="font-medium">
                          {material.classId?.className || material.module || 'Lecture Material'}
                        </span>
                        <span className="px-2.5 py-1 rounded-full border border-slate-200 text-[10px] font-semibold flex items-center gap-1">
                          {hasVideo && <Video className="w-3 h-3" />}
                          {hasFile && !hasVideo && <FileText className="w-3 h-3" />}
                          {materialType.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-base font-semibold text-slate-900 mb-2 line-clamp-1">{material.title}</p>
                      {material.facultyId?.name && (
                        <p className="text-sm text-slate-500 mb-2">{material.facultyId.name}</p>
                      )}
                      {material.module && (
                        <p className="text-sm text-slate-500 mb-2">{material.module}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                        {material.description && (
                          <>
                            <span>•</span>
                            <span className="line-clamp-1">{material.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Campus Updates</p>
                <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleNavigate('/student/academic/notifications')}>
                View all
              </Button>
            </div>
            {loadingAnnouncements ? (
              <div className="text-center py-8">
                <p className="text-sm text-slate-500">Loading announcements...</p>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No announcements available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => {
                  const getPriorityBadge = (priority) => {
                    switch (priority) {
                      case 'high':
                        return 'bg-red-100 text-red-700 border-red-200'
                      case 'medium':
                        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      case 'low':
                        return 'bg-blue-100 text-blue-700 border-blue-200'
                      default:
                        return 'bg-slate-100 text-slate-700 border-slate-200'
                    }
                  }
                  const getPriorityLabel = (priority) => {
                    switch (priority) {
                      case 'high':
                        return 'High'
                      case 'medium':
                        return 'Medium'
                      case 'low':
                        return 'Low'
                      default:
                        return 'Normal'
                    }
                  }
                  return (
                    <div
                      key={announcement._id}
                      onClick={() => handleNavigate('/student/academic/notifications')}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-5 hover:bg-white hover:shadow-md transition-all space-y-2 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 mb-1">{announcement.title}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold ml-3 border ${getPriorityBadge(announcement.priority)}`}
                        >
                          {getPriorityLabel(announcement.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{announcement.message}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Service Cards */}
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
            <p className="text-slate-600 mt-2">
              Access all your academic tools and resources from one centralized location.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCards.map((card, idx) => {
              const Icon = card.icon
              return (
                <motion.button
                  key={idx}
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate(card.path)}
                  className="text-left p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all min-h-[180px] flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">{card.title}</h4>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{card.description}</p>
                  <p className="text-xs font-semibold text-blue-600">{card.stat}</p>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </MainLayout>
  )
}

export default AcademicCampus
