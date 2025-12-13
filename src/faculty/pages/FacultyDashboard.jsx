import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { 
  BookOpen, 
  Users, 
  ClipboardList, 
  Calendar,
  CalendarCheck,
  AlertTriangle,
  Sparkles,
  FileText,
  GraduationCap,
  ArrowRight
} from 'lucide-react'
import { getFacultyDashboardSummaryAPI } from '../../services/api'
import toast from 'react-hot-toast'

const FacultyDashboard = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState({
    assignedClasses: 0,
    subjectsHandled: 0,
    totalAssignments: 0,
    pendingGrading: 0,
    todayClasses: 0,
    recentActivities: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const res = await getFacultyDashboardSummaryAPI()
      if (res?.status === 200) {
        setDashboardData({
          assignedClasses: res.data.assignedClasses || 0,
          subjectsHandled: res.data.subjectsHandled || 0,
          totalAssignments: res.data.totalAssignments || 0,
          pendingGrading: res.data.pendingGrading || 0,
          todayClasses: res.data.todayClasses || 0,
          recentActivities: res.data.recentActivities || []
        })
      } else {
        // Set all to 0 if API fails
        setDashboardData({
          assignedClasses: 0,
          subjectsHandled: 0,
          totalAssignments: 0,
          pendingGrading: 0,
          todayClasses: 0,
          recentActivities: []
        })
        toast.error('Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Set all to 0 on error
      setDashboardData({
        assignedClasses: 0,
        subjectsHandled: 0,
        totalAssignments: 0,
        pendingGrading: 0,
        todayClasses: 0,
        recentActivities: []
      })
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Summary Cards
  const summaryCards = [
    {
      label: 'Total Classes',
      value: loading ? '...' : dashboardData.assignedClasses,
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600',
      onClick: () => navigate('/faculty/students')
    },
    {
      label: 'Active Assignments',
      value: loading ? '...' : dashboardData.totalAssignments,
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      onClick: () => navigate('/faculty/assignments')
    },
    {
      label: 'Pending Grading',
      value: loading ? '...' : dashboardData.pendingGrading,
      icon: ClipboardList,
      color: 'from-orange-500 to-orange-600',
      onClick: () => navigate('/faculty/grading')
    },
    {
      label: 'Today\'s Classes',
      value: loading ? '...' : dashboardData.todayClasses,
      icon: CalendarCheck,
      color: 'from-rose-500 to-rose-600',
      onClick: () => navigate('/faculty/attendance')
    }
  ]

  // Action Shortcuts
  const actionShortcuts = [
    { 
      title: 'Academic Materials', 
      desc: 'Upload lecture notes, PPTs, and study materials',
      icon: BookOpen, 
      path: '/faculty/academic',
      color: 'blue'
    },
    { 
      title: 'Assignments', 
      desc: 'Create and review student assignments',
      icon: FileText, 
      path: '/faculty/assignments',
      color: 'indigo'
    },
    { 
      title: 'Attendance', 
      desc: 'Mark and track student attendance',
      icon: Calendar, 
      path: '/faculty/attendance',
      color: 'green'
    },
    { 
      title: 'Grading', 
      desc: 'Manage grades and exam marks',
      icon: ClipboardList, 
      path: '/faculty/grading',
      color: 'orange'
    },
    { 
      title: 'Leave Requests', 
      desc: 'Approve or reject student leave requests',
      icon: CalendarCheck, 
      path: '/faculty/leave-requests',
      color: 'rose'
    },
    { 
      title: 'Complaints', 
      desc: 'View and respond to student complaints',
      icon: AlertTriangle, 
      path: '/faculty/complaints',
      color: 'amber'
    }
  ]

  return (
    <FacultyLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Faculty Dashboard</p>
            <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
            <p className="text-slate-600">Quick summary and navigation to all faculty features</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card onClick={card.onClick} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{card.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                    </div>
                    <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Action Shortcuts */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actionShortcuts.map((action, idx) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(action.path)}
                  className="p-5 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-${action.color}-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 text-${action.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-slate-600">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.button>
              )
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/faculty/notifications')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500 text-center py-4">Loading activities...</p>
            ) : dashboardData.recentActivities.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No recent activity</p>
            ) : (
              dashboardData.recentActivities.map((activity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(activity.path)}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-300 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.text}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </motion.div>
    </FacultyLayout>
  )
}

export default FacultyDashboard
