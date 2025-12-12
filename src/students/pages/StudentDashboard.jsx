import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Briefcase, 
  Clock, 
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  User,
  Bell
} from 'lucide-react'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import { weeklyTimetable } from '../data/academicData'
import { getStudentAttendanceSummaryAPI } from '../../services/attendanceAPI'
import { getTodayClassesAPI, getTimetableAPI } from '../../services/timetableAPI'
import { getStudentAnnouncementsAPI } from '../../services/announcementAPI'
import { getUpcomingDeadlinesAPI } from '../../services/assignmentAPI'
import toast from 'react-hot-toast'

const StudentDashboard = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showTimetableModal, setShowTimetableModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [attendanceSummary, setAttendanceSummary] = useState({
    percentage: 0,
    totalClasses: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0
  })
  const [loadingAttendance, setLoadingAttendance] = useState(true)
  const [todayClasses, setTodayClasses] = useState([])
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [fullTimetable, setFullTimetable] = useState(null)
  const [loadingTimetable, setLoadingTimetable] = useState(false)
  const [studentClassName, setStudentClassName] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])
  const [loadingDeadlines, setLoadingDeadlines] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    loadAttendanceSummary()
    loadTodayClasses()
    loadAnnouncements()
    loadUpcomingDeadlines()
  }, [])

  const loadAttendanceSummary = async () => {
    try {
      setLoadingAttendance(true)
      const res = await getStudentAttendanceSummaryAPI()
      if (res?.status === 200) {
        // New API returns { summary: [], overall: {} }
        const overall = res.data.overall || res.data // Support both old and new format
        setAttendanceSummary({
          percentage: overall.percentage || 0,
          totalClasses: overall.totalClasses || 0,
          presentCount: overall.presentCount || 0,
          absentCount: overall.absentCount || 0,
          lateCount: overall.lateCount || 0
        })
      }
    } catch (error) {
      console.error('Error loading attendance summary:', error)
    } finally {
      setLoadingAttendance(false)
    }
  }

  const loadTodayClasses = async () => {
    try {
      setLoadingClasses(true)
      const res = await getTodayClassesAPI()
      if (res?.status === 200) {
        setTodayClasses(res.data.classes || [])
        if (res.data.className) {
          setStudentClassName(res.data.className)
        }
      } else {
        // Fallback to dummy data if API fails
        setTodayClasses([
          { time: '09:00 AM', subject: 'Data Structures', room: 'A-101', instructor: 'Dr. Smith' },
          { time: '11:00 AM', subject: 'Web Development', room: 'B-205', instructor: 'Prof. Johnson' },
          { time: '02:00 PM', subject: 'Database Systems', room: 'A-102', instructor: 'Dr. Williams' }
        ])
      }
    } catch (error) {
      console.error('Error loading today classes:', error)
      // Fallback to dummy data
      setTodayClasses([
        { time: '09:00 AM', subject: 'Data Structures', room: 'A-101', instructor: 'Dr. Smith' },
        { time: '11:00 AM', subject: 'Web Development', room: 'B-205', instructor: 'Prof. Johnson' },
        { time: '02:00 PM', subject: 'Database Systems', room: 'A-102', instructor: 'Dr. Williams' }
      ])
    } finally {
      setLoadingClasses(false)
    }
  }

  const loadFullTimetable = async () => {
    if (!studentClassName) {
      // Fallback to dummy data if className not available
      setFullTimetable(null)
      return
    }

    try {
      setLoadingTimetable(true)
      const res = await getTimetableAPI(studentClassName)
      if (res?.status === 200 && res.data.timetable) {
        // Convert backend format to frontend format
        const timetable = res.data.timetable
        const daysMap = {}
        timetable.slots.forEach(slot => {
          if (!daysMap[slot.day]) {
            daysMap[slot.day] = []
          }
          daysMap[slot.day].push({
            time: `${slot.startTime} - ${slot.endTime}`,
            subject: slot.subject,
            room: slot.room || '',
            instructor: slot.faculty?.name || 'TBD'
          })
        })
        setFullTimetable(daysMap)
      } else {
        // Fallback to dummy data
        setFullTimetable(null)
      }
    } catch (error) {
      console.error('Error loading full timetable:', error)
      setFullTimetable(null)
    } finally {
      setLoadingTimetable(false)
    }
  }

  const stats = {
    attendance: attendanceSummary.percentage,
    grades: 3.8,
    skillsCompleted: 12,
    placementsApplied: 5,
    assignmentsPending: 3,
    upcomingExams: 2
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

  const loadUpcomingDeadlines = async () => {
    try {
      setLoadingDeadlines(true)
      const res = await getUpcomingDeadlinesAPI()
      if (res?.status === 200) {
        const deadlines = (res.data.deadlines || []).map(deadline => {
          const dueDate = new Date(deadline.dueDate)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const diffTime = dueDate - today
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          let dueDateText = ''
          let priority = 'low'
          if (diffDays < 0) {
            dueDateText = 'Overdue'
            priority = 'high'
          } else if (diffDays === 0) {
            dueDateText = 'Today'
            priority = 'high'
          } else if (diffDays === 1) {
            dueDateText = 'Tomorrow'
            priority = 'high'
          } else if (diffDays <= 3) {
            dueDateText = `${diffDays} days`
            priority = 'medium'
          } else {
            dueDateText = `${diffDays} days`
            priority = 'low'
          }

          return {
            id: deadline.id,
            title: deadline.title,
            subject: deadline.subject,
            dueDate: dueDateText,
            priority
          }
        })
        setUpcomingDeadlines(deadlines)
      }
    } catch (error) {
      console.error('Error loading upcoming deadlines:', error)
    } finally {
      setLoadingDeadlines(false)
    }
  }

  const statCards = [
    {
      label: 'Attendance',
      value: `${stats.attendance}%`,
      trend: '+2%',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => navigate('/student/academic/attendance')
    },
    {
      label: 'GPA',
      value: stats.grades,
      trend: '+0.2',
      icon: TrendingUp,
      color: 'from-slate-700 to-slate-800',
      bgColor: 'bg-slate-50',
      onClick: () => navigate('/student/academic/grades')
    },
    {
      label: 'Skills Completed',
      value: stats.skillsCompleted,
      trend: '+3',
      icon: BookOpen,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      onClick: () => navigate('/student/skills')
    },
    {
      label: 'Placements Applied',
      value: stats.placementsApplied,
      trend: '+1',
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      onClick: () => navigate('/student/placement')
    }
  ]

  const quickActions = [
    { title: 'Academic & Campus', desc: 'Access notices, timetable, lectures', icon: BookOpen, path: '/student/academic', color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-100', textColor: 'text-blue-600' },
    { title: 'Skills & Learning', desc: 'Browse skills, training modules', icon: BookOpen, path: '/student/skills', color: 'indigo', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-100', textColor: 'text-indigo-600' },
    { title: 'Placement & Internship', desc: 'Upload resume, browse jobs', icon: Briefcase, path: '/student/placement', color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-100', textColor: 'text-purple-600' },
    { title: 'Events & Activities', desc: 'Fests, workshops, placements', icon: Calendar, path: '/student/academic/events', color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-100', textColor: 'text-purple-600' }
  ]

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 p-4 md:p-6"
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Welcome back! 👋
          </h1>
          <p className="text-lg text-slate-600">
            Here's what's happening with your academics today
          </p>
        </div>

        {/* Stats Grid - Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card
                  onClick={stat.onClick}
                  className="relative overflow-hidden group cursor-pointer p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-md`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                      <div className="text-xs text-green-600 font-semibold flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.trend}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-semibold text-slate-700">{stat.label}</div>
                    <div className="text-xs text-slate-500 mt-1">View Details →</div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quickActions.map((action, idx) => {
                    const Icon = action.icon
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -4 }}
                      >
                        <Card
                          onClick={() => navigate(action.path)}
                          className="cursor-pointer group p-6 hover:shadow-lg transition-all"
                        >
                          <div className={`w-16 h-16 ${action.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border-2 ${action.borderColor}`}>
                            <Icon className={`w-8 h-8 ${action.textColor}`} />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">{action.title}</h3>
                          <p className="text-slate-600 text-sm mb-4">{action.desc}</p>
                          <div className={`flex items-center ${action.textColor} text-sm font-semibold`}>
                            Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Upcoming Deadlines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Upcoming Deadlines</h3>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/student/academic/assignments')}>
                    View All →
                  </Button>
                </div>
                {loadingDeadlines ? (
                  <div className="text-sm text-slate-500 py-8 text-center">Loading deadlines...</div>
                ) : upcomingDeadlines.length === 0 ? (
                  <div className="text-sm text-slate-500 py-8 text-center">
                    No upcoming deadlines
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline, idx) => (
                      <motion.div
                        key={deadline.id || idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        className={`p-5 rounded-xl border-l-4 ${
                          deadline.priority === 'high'
                            ? 'border-red-500 bg-red-50'
                            : deadline.priority === 'medium'
                              ? 'border-yellow-500 bg-yellow-50'
                              : 'border-blue-500 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-base text-slate-900 mb-1">{deadline.title}</div>
                            <div className="text-sm text-slate-600">{deadline.subject}</div>
                          </div>
                          <div className={`text-xs font-semibold px-4 py-2 rounded-full ${
                            deadline.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : deadline.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                          }`}>
                            {deadline.dueDate}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-8">
            {/* Today's Classes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Today's Classes</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedDay('Monday')
                      setShowTimetableModal(true)
                      if (!fullTimetable && !loadingTimetable) {
                        loadFullTimetable()
                      }
                    }}
                  >
                    View All
                  </Button>
                </div>
                {loadingClasses ? (
                  <div className="text-sm text-slate-500 py-8 text-center">Loading classes...</div>
                ) : (
                  <div className="space-y-4">
                    {todayClasses.slice(0, 3).map((classItem, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-base text-slate-900">{classItem.subject}</div>
                          <div className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-lg">
                            {classItem.time}
                          </div>
                        </div>
                        <div className="text-sm text-slate-600">{classItem.room} • {classItem.instructor}</div>
                      </motion.div>
                    ))}
                    {todayClasses.length === 0 && (
                      <div className="text-sm text-slate-500 py-8 text-center">
                        No classes scheduled for today
                      </div>
                    )}
                    {todayClasses.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedDay('Monday')
                          setShowTimetableModal(true)
                          if (!fullTimetable && !loadingTimetable) {
                            loadFullTimetable()
                          }
                        }}
                      >
                        Show all {todayClasses.length} classes
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Attendance Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Attendance Summary</h3>
                </div>
                {loadingAttendance ? (
                  <div className="text-sm text-slate-500 py-8 text-center">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="text-4xl font-bold text-slate-900 mb-2">{attendanceSummary.percentage}%</div>
                      <div className="text-sm text-slate-600">Overall Attendance</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-lg font-bold text-slate-900">{attendanceSummary.presentCount}</div>
                        <div className="text-xs text-slate-600">Present</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-lg font-bold text-slate-900">{attendanceSummary.absentCount}</div>
                        <div className="text-xs text-slate-600">Absent</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-lg font-bold text-slate-900">{attendanceSummary.lateCount}</div>
                        <div className="text-xs text-slate-600">Late</div>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => navigate('/student/academic/attendance')}
                    >
                      View Full Report
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Announcements Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Announcements</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/student/academic/announcements')}
                  >
                    View All
                  </Button>
                </div>
                {loadingAnnouncements ? (
                  <div className="text-sm text-slate-500 py-8 text-center">Loading announcements...</div>
                ) : announcements.length === 0 ? (
                  <div className="text-sm text-slate-500 py-8 text-center">
                    No announcements
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((announcement, idx) => {
                      const getPriorityColor = (priority) => {
                        switch (priority) {
                          case 'high':
                            return 'border-red-500 bg-red-50'
                          case 'medium':
                            return 'border-yellow-500 bg-yellow-50'
                          case 'low':
                            return 'border-blue-500 bg-blue-50'
                          default:
                            return 'border-slate-200 bg-slate-50'
                        }
                      }
                      const getPriorityBadge = (priority) => {
                        switch (priority) {
                          case 'high':
                            return <span className="text-xs font-semibold text-red-700">🔴 High</span>
                          case 'medium':
                            return <span className="text-xs font-semibold text-yellow-700">🟡 Medium</span>
                          case 'low':
                            return <span className="text-xs font-semibold text-blue-700">🟢 Low</span>
                          default:
                            return null
                        }
                      }
                      return (
                        <motion.div
                          key={announcement._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.1 }}
                          className={`p-4 rounded-xl border-l-4 ${getPriorityColor(announcement.priority)} hover:shadow-md transition-all cursor-pointer`}
                          onClick={() => navigate('/student/academic/announcements')}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{announcement.title}</h4>
                            {getPriorityBadge(announcement.priority)}
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 mb-2">{announcement.message}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </p>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Timetable Modal */}
        <Modal
          isOpen={showTimetableModal}
          onClose={() => setShowTimetableModal(false)}
          title={`Timetable - ${selectedDay}`}
          size="lg"
        >
          {loadingTimetable ? (
            <div className="text-center py-8 text-slate-500">Loading timetable...</div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6 bg-slate-50 rounded-xl p-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                      selectedDay === day
                        ? 'bg-white shadow text-slate-900'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {fullTimetable && fullTimetable[selectedDay] && fullTimetable[selectedDay].length > 0 ? (
                  fullTimetable[selectedDay].map((slot, idx) => (
                    <div
                      key={`${slot.time}-${idx}`}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50"
                    >
                      <div>
                        <p className="text-xs text-slate-500">Time</p>
                        <p className="text-sm font-semibold text-slate-900">{slot.time}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Subject</p>
                        <p className="text-sm font-semibold text-slate-900">{slot.subject}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Faculty</p>
                        <p className="text-sm text-slate-700">{slot.instructor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Room</p>
                        <p className="text-sm text-slate-700">{slot.room || 'TBD'}</p>
                      </div>
                    </div>
                  ))
                ) : fullTimetable === null ? (
                  // Fallback to dummy data if API fails
                  weeklyTimetable.find(d => d.day === selectedDay)?.classes?.map((slot, idx) => (
                    <div
                      key={`${slot.time}-${idx}`}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50"
                    >
                      <div>
                        <p className="text-xs text-slate-500">Time</p>
                        <p className="text-sm font-semibold text-slate-900">{slot.time}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Subject</p>
                        <p className="text-sm font-semibold text-slate-900">{slot.subject}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Faculty</p>
                        <p className="text-sm text-slate-700">{slot.instructor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Room</p>
                        <p className="text-sm text-slate-700">{slot.room}</p>
                      </div>
                    </div>
                  )) || <div className="text-center py-8 text-slate-500">No classes scheduled for {selectedDay}</div>
                ) : (
                  <div className="text-center py-8 text-slate-500">No classes scheduled for {selectedDay}</div>
                )}
              </div>
            </>
          )}
        </Modal>
      </motion.div>
    </MainLayout>
  )
}

export default StudentDashboard
