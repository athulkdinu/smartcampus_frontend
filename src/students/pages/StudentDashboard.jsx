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
  AlertCircle
} from 'lucide-react'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { weeklyTimetable } from '../data/academicData'
import { getStudentAttendanceSummaryAPI } from '../../services/attendanceAPI'

const StudentDashboard = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showTimetableModal, setShowTimetableModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState(weeklyTimetable[0])
  const [attendanceSummary, setAttendanceSummary] = useState({
    percentage: 0,
    totalClasses: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0
  })
  const [loadingAttendance, setLoadingAttendance] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    loadAttendanceSummary()
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

  const stats = {
    attendance: attendanceSummary.percentage,
    grades: 3.8,
    skillsCompleted: 12,
    placementsApplied: 5,
    assignmentsPending: 3,
    upcomingExams: 2
  }

  const subjectPerformance = [
    { subject: 'DS', score: 92 },
    { subject: 'Web Dev', score: 88 },
    { subject: 'DBMS', score: 85 },
    { subject: 'OS', score: 90 },
    { subject: 'CN', score: 87 }
  ]

  const progressData = [
    { name: 'Completed', value: 65, color: '#3b82f6' },
    { name: 'In Progress', value: 25, color: '#8b5cf6' },
    { name: 'Pending', value: 10, color: '#e2e8f0' }
  ]

  const upcomingClasses = [
    { time: '09:00 AM', subject: 'Data Structures', room: 'A-101', instructor: 'Dr. Smith' },
    { time: '11:00 AM', subject: 'Web Development', room: 'B-205', instructor: 'Prof. Johnson' },
    { time: '02:00 PM', subject: 'Database Systems', room: 'A-102', instructor: 'Dr. Williams' }
  ]

  const recentActivities = [
    { type: 'assignment', title: 'Submitted: Web Development Project', time: '2 hours ago', icon: CheckCircle2, color: 'text-green-600' },
    { type: 'notice', title: 'New Notice: Library Hours Extended', time: '5 hours ago', icon: AlertCircle, color: 'text-blue-600' },
    { type: 'grade', title: 'Grade Updated: Data Structures', time: '1 day ago', icon: Award, color: 'text-purple-600' },
    { type: 'skill', title: 'Completed: JavaScript Fundamentals', time: '2 days ago', icon: CheckCircle2, color: 'text-indigo-600' }
  ]

  const upcomingDeadlines = [
    { title: 'Database Assignment', subject: 'Database Systems', dueDate: 'Tomorrow', priority: 'high' },
    { title: 'Web Dev Project', subject: 'Web Development', dueDate: '3 days', priority: 'medium' },
    { title: 'Research Paper', subject: 'Data Structures', dueDate: '1 week', priority: 'low' }
  ]

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
    { title: 'Academic & Campus', desc: 'Access notices, timetable, lectures', icon: BookOpen, path: '/student/academic', color: 'blue' },
    { title: 'Skills & Learning', desc: 'Browse skills, training modules', icon: BookOpen, path: '/student/skills', color: 'indigo' },
    { title: 'Placement & Internship', desc: 'Upload resume, browse jobs', icon: Briefcase, path: '/student/placement', color: 'purple' },
    { title: 'Events & Activities', desc: 'Fests, workshops, placements', icon: Calendar, path: '/student/academic/events', color: 'purple' }
  ]

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, Student! 👋
            </h1>
            <p className="text-slate-600">
              Here's what's happening with your academics today
            </p>
          </div>
          
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className="relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-xs text-green-600 font-semibold flex items-center justify-end gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {stat.trend}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">{stat.label}</div>
                    <div className="text-xs text-slate-500 mt-1">View Details →</div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Assignments Pending', value: stats.assignmentsPending, color: 'text-orange-600', bgColor: 'bg-orange-50' },
            { label: 'Upcoming Exams', value: stats.upcomingExams, color: 'text-red-600', bgColor: 'bg-red-50' },
            { label: 'Certificates', value: 8, color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { label: 'upcoming Events', value: '3', color: 'text-indigo-600', bgColor: 'bg-indigo-50' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
            >
              <Card className={`${stat.bgColor} border-0`}>
                <div className="text-xs font-medium text-slate-600 mb-1">{stat.label}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div> */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
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
                        className="cursor-pointer group"
                      >
                        <div className={`w-14 h-14 bg-${action.color}-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border-2 border-${action.color}-100`}>
                          <Icon className={`w-7 h-7 text-${action.color}-600`} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{action.title}</h3>
                        <p className="text-slate-600 text-sm mb-4">{action.desc}</p>
                        <div className={`flex items-center text-${action.color}-600 text-sm font-semibold`}>
                          Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Subject Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Subject Performance</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="subject" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                    />
                    <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Upcoming Deadlines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Upcoming Deadlines</h3>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/student/academic/assignments')}>
                    View All →
                  </Button>
                </div>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className={`p-4 rounded-xl border-l-4 ${
                        deadline.priority === 'high'
                          ? 'border-red-500 bg-red-50'
                          : deadline.priority === 'medium'
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-sm text-slate-900">{deadline.title}</div>
                          <div className="text-xs text-slate-600 mt-1">{deadline.subject}</div>
                        </div>
                        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
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
              </Card>
            </motion.div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Today's Classes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">Today's Classes</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedDay(weeklyTimetable[0])
                      setShowTimetableModal(true)
                    }}
                  >
                    View Timetable
                  </Button>
                </div>
                <div className="space-y-3">
                  {upcomingClasses.map((classItem, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-semibold text-sm text-slate-900">{classItem.subject}</div>
                        <div className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
                          {classItem.time}
                        </div>
                      </div>
                      <div className="text-xs text-slate-600">{classItem.room} • {classItem.instructor}</div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Progress Overview</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <h3 className="text-lg font-bold text-slate-900 mb-5">Recent Activities</h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, idx) => {
                    const Icon = activity.icon
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        className="p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer border border-slate-200"
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 ${activity.color} mt-0.5 flex-shrink-0`} />
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-slate-900 mb-1">{activity.title}</div>
                            <div className="text-xs text-slate-500">{activity.time}</div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Timetable Modal */}
        <Modal
          isOpen={showTimetableModal}
          onClose={() => setShowTimetableModal(false)}
          title={`Timetable - ${selectedDay?.day}`}
          size="lg"
        >
          <div className="flex items-center gap-2 mb-6 bg-slate-50 rounded-xl p-2">
            {weeklyTimetable.map((day) => (
              <button
                key={day.day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  selectedDay?.day === day.day
                    ? 'bg-white shadow text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {day.day.slice(0, 3)}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {selectedDay?.classes?.map((slot, idx) => (
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
            ))}
          </div>
        </Modal>
      </motion.div>
    </MainLayout>
  )
}

export default StudentDashboard
