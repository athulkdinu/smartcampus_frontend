import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Users, Calendar, MessageSquare, AlertTriangle, UserPlus, Settings, ArrowRight } from 'lucide-react'
import { getAllUsersAPI, getAllFacultyAPI, getAdminUsersAPI, getAdminEventsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalHR: 0,
    activeEvents: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load all users to count students
      const usersRes = await getAllUsersAPI()
      const students = usersRes?.data?.users?.filter(u => u.role === 'student') || []
      
      // Load faculty
      const facultyRes = await getAllFacultyAPI()
      const faculty = facultyRes?.data?.faculty || []
      
      // Load HR/Admin accounts
      const hrRes = await getAdminUsersAPI()
      const hr = hrRes?.data?.admins?.filter(u => u.role === 'hr') || []
      
      // Load events
      const eventsRes = await getAdminEventsAPI()
      const events = eventsRes?.data?.events || []
      const activeEvents = events.filter(e => ['approved', 'active'].includes(e.status?.toLowerCase()))
      
      setStats({
        totalStudents: students.length,
        totalFaculty: faculty.length,
        totalHR: hr.length,
        activeEvents: activeEvents.length
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { 
      label: 'Total Students', 
      value: stats.totalStudents.toLocaleString(), 
      accent: 'from-blue-500 to-cyan-500', 
      subtext: 'Active enrolments', 
      icon: Users 
    },
    { 
      label: 'Total Faculty', 
      value: stats.totalFaculty, 
      accent: 'from-indigo-500 to-purple-500', 
      subtext: 'Teaching & mentors', 
      icon: Users 
    },
    { 
      label: 'Total HR', 
      value: stats.totalHR, 
      accent: 'from-emerald-500 to-teal-500', 
      subtext: 'Recruitment partners', 
      icon: Users 
    },
    { 
      label: 'Active Events', 
      value: stats.activeEvents, 
      accent: 'from-pink-500 to-rose-500', 
      subtext: 'Live campus activities', 
      icon: Calendar 
    }
  ]

  const actionCards = [
    {
      title: 'User Management',
      description: 'Manage students, faculty, and HR accounts',
      icon: UserPlus,
      path: '/admin/users',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Event Management',
      description: 'Review and approve event requests',
      icon: Calendar,
      path: '/admin/events',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Complaint Center',
      description: 'View and resolve pending complaints',
      icon: AlertTriangle,
      path: '/admin/complaints',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Communication Center',
      description: 'Send messages and broadcasts',
      icon: MessageSquare,
      path: '/admin/communication',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    }
  ]

  return (
    <AdminLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="space-y-8 p-4 md:p-6"
      >
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Admin Dashboard</h1>
          <p className="text-lg text-slate-300">Monitor and manage campus operations from a single control center</p>
        </div>

        {/* Dashboard Overview Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className="relative overflow-hidden p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${stat.accent} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                      {loading ? (
                        <div className="h-8 w-20 bg-slate-200 rounded animate-pulse" />
                      ) : (
                        <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                      )}
                      <p className="text-xs text-slate-500">{stat.subtext}</p>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Management Tools Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Management Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actionCards.map((action, idx) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card 
                    className="p-6 cursor-pointer hover:shadow-xl transition-all group"
                    onClick={() => navigate(action.path)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 ${action.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-8 h-8 ${action.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{action.title}</h3>
                        <p className="text-sm text-slate-600 mb-4">{action.description}</p>
                        <div className={`flex items-center ${action.textColor} text-sm font-semibold`}>
                          Open <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  )
}

export default AdminDashboard
