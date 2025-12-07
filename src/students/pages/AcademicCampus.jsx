import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMemo, useState, useEffect } from 'react'
import { ArrowRight, Calendar, BookOpen, Bell, TrendingUp, Video, FileText } from 'lucide-react'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import {
  notices,
  attendanceData,
  overallAttendance,
  assignments,
  gradesData,
  exams,
  leaveRequests,
  complaints,
} from '../data/academicData'
import { getInboxAPI } from '../../services/communicationAPI'
import { getStudentLecturesAPI } from '../../services/lectureAPI'

const AcademicCampus = () => {
  const navigate = useNavigate()
  const [lectureMaterials, setLectureMaterials] = useState([])
  const [loadingLectures, setLoadingLectures] = useState(true)
  const [communications, setCommunications] = useState([])

  useEffect(() => {
    loadLectureMaterials()
    loadMessages()
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

  const pendingAssignments = assignments.filter(item => item.status !== 'submitted').length

  const performanceScore = useMemo(() => {
    const gradePoints = { 'A+': 10, A: 9, 'A-': 8.5, 'B+': 8, B: 7 }
    const average =
      gradesData.reduce((acc, subject) => acc + (gradePoints[subject.overall] || 7), 0) /
      gradesData.length
    return average.toFixed(1)
  }, [])

  const quickStats = [
    {
      title: 'Grade Snapshot',
      metric: gradesData[0]?.overall || 'A',
      meta: `${performanceScore} / 10 performance`,
      trend: '+2% from last term',
      path: '/student/academic/grades',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Attendance Health',
      metric: `${overallAttendance}%`,
      meta: `${attendanceData.length} subjects`,
      trend: 'Stable this week',
      path: '/student/academic/attendance',
      icon: Calendar,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Assignments Due',
      metric: pendingAssignments,
      meta: 'Pending submissions',
      trend: '2 due soon',
      path: '/student/academic/assignments',
      icon: BookOpen,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const serviceCards = [
    { title: 'Academic Grades', description: 'Subject-wise breakdown & transcripts.', stat: `${gradesData.length} subjects`, path: '/student/academic/grades', icon: TrendingUp },
    { title: 'Attendance Insights', description: 'Daily tracker, warnings & trends.', stat: `${overallAttendance}% overall`, path: '/student/academic/attendance', icon: Calendar },
    { title: 'Assignments Board', description: 'Submissions, feedback & timers.', stat: `${assignments.length} tasks`, path: '/student/academic/assignments', icon: BookOpen },
    { title: 'Leave Portal', description: 'Apply, upload proofs & track approvals.', stat: `${leaveRequests.length} records`, path: '/student/academic/leave', icon: Calendar },
    { title: 'Exam Hub', description: 'Schedules, seating & hall tickets.', stat: `${exams.length} upcoming`, path: '/student/academic/exams', icon: BookOpen },
    { title: 'Complaints Desk', description: 'Raise infra/service concerns.', stat: `${complaints.length} tickets`, path: '/student/academic/complaints', icon: Bell }
  ]

  // Get first 4 lecture materials for highlights
  const lectureHighlights = lectureMaterials.slice(0, 4)
  const noticeHighlights = notices.slice(0, 3)

  const handleNavigate = (path) => navigate(path)

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white rounded-2xl p-8 md:p-12">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_55%)]"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-slate-300">Academic workspace</p>
                <h1 className="text-3xl sm:text-4xl font-bold">Academic & Campus</h1>
              <p className="text-slate-200 text-sm sm:text-base max-w-2xl">
                  A comprehensive information surface that highlights classes, attention areas, notifications and navigation into every academic tool.
              </p>
              <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => navigate('/student/dashboard')}>
                  Back to dashboard
                  </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
                {quickStats.map((card, idx) => {
                  const Icon = card.icon
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/10 border border-white/15 rounded-xl p-4 backdrop-blur shadow-lg cursor-pointer hover:bg-white/15 transition-colors"
                      onClick={() => handleNavigate(card.path)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-white/70" />
                  <p className="text-xs uppercase tracking-wide text-white/70">{card.title}</p>
                      </div>
                      <p className="text-2xl font-bold">{card.metric}</p>
                  <p className="text-xs text-white/70 mt-1">{card.meta}</p>
                  <p className="text-[11px] font-semibold text-emerald-200 mt-2">{card.trend}</p>
                    </motion.div>
                  )
                })}
                </div>
            </div>
          </div>
        </div>

        {/* Messages & Communications */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Mailbox</p>
              <h2 className="text-xl font-bold text-slate-900">Mentors & Faculty</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleNavigate('/student/academic/messages')}>
              View all
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communications.length > 0 ? (
              communications.map((message) => (
                <div key={message.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{message.from}</p>
                      <p className="text-xs text-slate-500">{message.role}</p>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {message.timestamp ? new Date(message.timestamp).toLocaleDateString() : ''}
                    </span>
                  </div>
                  {message.subject && (
                    <p className="text-xs font-medium text-slate-700 mb-1">{message.subject}</p>
                  )}
                  <p className="text-sm text-slate-600 line-clamp-3">{message.preview || message.body || message.message}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-4 text-slate-400 text-sm">
                No messages
              </div>
            )}
          </div>
        </Card>

        {/* Lecture Highlights & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
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
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:bg-white hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleNavigate('/student/academic/lectures')}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="font-medium">
                          {material.classId?.className || material.module || 'Lecture Material'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-semibold flex items-center gap-1">
                          {hasVideo && <Video className="w-3 h-3" />}
                          {hasFile && !hasVideo && <FileText className="w-3 h-3" />}
                          {materialType.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-base font-semibold text-slate-900 mb-1 line-clamp-1">{material.title}</p>
                      {material.facultyId?.name && (
                        <p className="text-xs text-slate-500 mb-2">{material.facultyId.name}</p>
                      )}
                      {material.module && (
                        <p className="text-xs text-slate-500 mb-2">{material.module}</p>
                      )}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
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
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Campus Updates</p>
                <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleNavigate('/student/academic/notifications')}>
                View all
              </Button>
            </div>
            <div className="space-y-4">
              {noticeHighlights.map((notice) => (
                <div key={notice.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:bg-white hover:shadow-md transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 mb-1">{notice.title}</p>
                      <p className="text-xs text-slate-500">{notice.date}</p>
                    </div>
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ml-3 ${
                        notice.priority === 'high'
                          ? 'bg-red-50 text-red-600'
                          : notice.priority === 'medium'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {notice.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{notice.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Service Cards */}
        <div className="space-y-6">
          <div className="space-y-2">
            {/* <p className="text-xs uppercase tracking-wide text-slate-500">Workspaces</p> */}
            <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
            {/* <p className="text-slate-600 max-w-2xl">
              Access all your academic tools and resources from one centralized location. Each workspace is designed for easy navigation and quick access to essential information.
            </p> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCards.map((card, idx) => {
              const Icon = card.icon
              return (
              <motion.button
                  key={idx}
                whileHover={{ y: -4 }}
                onClick={() => handleNavigate(card.path)}
                  className="text-left p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition min-h-[180px] flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">{card.title}</h4>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-slate-500 mt-3 line-clamp-2">{card.description}</p>
                <p className="text-xs font-semibold text-blue-600 mt-4">{card.stat}</p>
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
