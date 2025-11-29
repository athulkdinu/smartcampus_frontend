import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { BookOpen, Users, ClipboardList, Calendar, MessageSquare, Clock, AlertTriangle, Sparkles, ClipboardCheck } from 'lucide-react'
import { getActiveFacultyProfile } from '../utils/getActiveFaculty'
import { leaveRequestTickets, eventProposals, complaintTickets, assignmentWorkflows, skillProgramCatalogue } from '../../shared/data/workflowData'
import { getFacultyClassesAPI } from '../../services/api'

const FacultyDashboard = () => {
  const navigate = useNavigate()
  const [facultyClasses, setFacultyClasses] = useState([])
  const selectedFaculty = useMemo(() => getActiveFacultyProfile(), [])

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await getFacultyClassesAPI()
        if (res?.status === 200 && Array.isArray(res.data.classes)) {
          setFacultyClasses(res.data.classes)
        }
      } catch {
        // silently ignore, demo data will still show
      }
    }
    loadClasses()
  }, [])

  const statCards = [
    {
      label: 'Sections This Subject',
      value: selectedFaculty.stats.sections,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      onClick: () => {}
    },
    {
      label: 'Students Enrolled',
      value: selectedFaculty.stats.students,
      icon: Users,
      color: 'from-slate-600 to-slate-700',
      onClick: () => {}
    },
    {
      label: 'Pending Grading',
      value: selectedFaculty.stats.pendingGrading,
      icon: ClipboardList,
      color: 'from-orange-500 to-orange-600',
      onClick: () => {}
    },
    {
      label: 'Avg Attendance',
      value: `${selectedFaculty.stats.attendance}%`,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      onClick: () => {}
    },
    {
      label: 'Labs This Week',
      value: selectedFaculty.stats.labs,
      icon: ClipboardList,
      color: 'from-indigo-500 to-indigo-600',
      onClick: () => {}
    }
  ]

  const quickActions = [
    { title: 'Academic Management', desc: 'Share plans, upload files', icon: BookOpen, path: '/faculty/academic' },
    { title: 'Grading', desc: 'Manage grades and assignments', icon: ClipboardList, path: '/faculty/grading' },
    { title: 'Attendance', desc: 'Record and track attendance', icon: Calendar, path: '/faculty/attendance' },
    { title: 'Leave Requests', desc: 'Approve student leave tickets', icon: ClipboardCheck, path: '/faculty/leave-requests' },
    { title: 'Complaints Center', desc: 'Resolve or escalate issues', icon: AlertTriangle, path: '/faculty/complaints' },
    { title: 'Event Requests', desc: 'Review student proposals', icon: Sparkles, path: '/faculty/event-requests' }
  ]

  const workflowWidgets = [
    {
      title: 'Leave Requests',
      metric: leaveRequestTickets.filter(item => item.status === 'pending').length,
      meta: 'need your approval',
      accent: 'from-rose-500 to-rose-600',
      path: '/faculty/leave-requests'
    },
    {
      title: 'Event Proposals',
      metric: eventProposals.filter(item => item.status === 'pending').length,
      meta: 'awaiting faculty decision',
      accent: 'from-purple-500 to-indigo-500',
      path: '/faculty/event-requests'
    },
    {
      title: 'Complaints Queue',
      metric: complaintTickets.filter(item => item.status !== 'resolved').length,
      meta: 'open campus issues',
      accent: 'from-amber-500 to-orange-500',
      path: '/faculty/complaints'
    }
  ]

  const assignmentQueueCount = assignmentWorkflows.reduce((acc, assignment) => acc + assignment.submissions.filter(sub => sub.status !== 'accepted').length, 0)
  const publishedSkillPrograms = skillProgramCatalogue.filter(program => program.status !== 'draft').length

  return (
    <FacultyLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-wide text-slate-500">Faculty Dashboard</p>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {selectedFaculty.name}</h1>
            <p className="text-slate-600">
              Subject focus: {selectedFaculty.subject.name} ({selectedFaculty.subject.code})
            </p>
          </div>
          <div className="flex gap-3">
            {/* <Button variant="secondary">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button> */}
            <Button variant="primary">
              <MessageSquare className="w-4 h-4 mr-2" />
              Post Announcement
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card onClick={stat.onClick} className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Workflow Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowWidgets.map((widget, idx) => (
            <motion.div
              key={widget.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
                <div className="relative space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-700">{widget.title}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold">{widget.metric}</p>
                    <p className="text-sm text-black ">{widget.meta}</p>
                  </div>
                  <div className={`w-20 h-1 rounded-full bg-gradient-to-r ${widget.accent}`} />
                  <Button variant="ghost" className="text-slate-100 hover:text-white hover:bg-white/10" onClick={() => navigate(widget.path)}>
                    Manage
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Tasks */}
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Pending Tasks</h2>
                <Button variant="ghost" size="sm">View All →</Button>
              </div>
              <div className="space-y-3">
                {selectedFaculty.tasks.map((task, idx) => (
                  <motion.div
                    key={`${task.title}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-xl border-l-4 ${
                      task.priority === 'high'
                        ? 'border-red-500 bg-red-50'
                        : 'border-amber-500 bg-amber-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">{task.title}</h3>
                        <p className="text-sm text-slate-600">{task.context}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {task.dueDate}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-900">{assignmentQueueCount}</span> submissions waiting ·{' '}
                  <span className="font-semibold text-slate-900">{publishedSkillPrograms}</span> skill programs live
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <motion.button
                      key={action.title}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(action.path)}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md transition text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900">{action.title}</h3>
                      </div>
                      <p className="text-sm text-slate-600">{action.desc}</p>
                    </motion.button>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Today's Sessions */}
            <Card>
              <h2 className="text-lg font-bold text-slate-900 mb-5">Today's Sessions</h2>
              <div className="space-y-3">
                {selectedFaculty.todaysSessions.map((classItem, idx) => (
                  <motion.div
                    key={`${classItem.section}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">{classItem.section}</h3>
                        <p className="text-sm text-slate-600">{classItem.room} · {classItem.format}</p>
                      </div>
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
                        {classItem.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Users className="w-3 h-3" />
                      <span>{classItem.students} students</span>
                    </div>
                  </motion.div>
                ))}
                {selectedFaculty.todaysSessions.length === 0 && (
                  <p className="text-sm text-slate-500">No sessions scheduled for today.</p>
                )}
              </div>
            </Card>

            {/* Recent Activities */}
            <Card>
              <h2 className="text-lg font-bold text-slate-900 mb-5">Recent Activities</h2>
              <div className="space-y-3">
                {selectedFaculty.activities.map((activity, idx) => {
                  const Icon = activity.icon
                  return (
                    <motion.div
                      key={`${activity.title}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-slate-900 mb-1">{activity.title}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </FacultyLayout>
  )
}

export default FacultyDashboard
