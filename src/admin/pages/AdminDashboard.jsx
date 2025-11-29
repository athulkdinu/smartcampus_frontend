import { useMemo } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import { Users, Calendar, MessageSquare } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { userAccounts, recentActivities, campusEvents } from '../data/adminDemoData'

const AdminDashboard = () => {
  const stats = useMemo(() => {
    const students = userAccounts.filter(u => u.role === 'student').length
    const faculty = userAccounts.filter(u => u.role === 'faculty').length
    const hr = userAccounts.filter(u => u.role === 'hr').length
    const activeEventsCount = campusEvents.filter(e => ['Active', 'Approved'].includes(e.status)).length

    return {
      totalStudents: students,
      totalFaculty: faculty,
      totalHR: hr,
      activeEvents: activeEventsCount
    }
  }, [])

  const userGrowthData = [
    { month: 'Jan', students: 4500, faculty: 140 },
    { month: 'Feb', students: 4700, faculty: 145 },
    { month: 'Mar', students: 4900, faculty: 150 },
    { month: 'Apr', students: 5100, faculty: 153 },
    { month: 'May', students: 5200, faculty: 155 },
    { month: 'Jun', students: stats.totalStudents, faculty: stats.totalFaculty }
  ]

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents.toLocaleString(), accent: 'from-sky-500 to-cyan-400', subtext: 'Active enrolments', icon: Users },
    { label: 'Total Faculty', value: stats.totalFaculty, accent: 'from-indigo-500 to-violet-500', subtext: 'Teaching & mentors', icon: Users },
    { label: 'Total HR Accounts', value: stats.totalHR, accent: 'from-emerald-500 to-green-400', subtext: 'Recruitment partners', icon: Users },
    { label: 'Active Events', value: stats.activeEvents, accent: 'from-fuchsia-500 to-pink-500', subtext: 'Live campus activities', icon: Calendar }
  ]

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-8 border border-white/10 shadow-[0_20px_60px_rgba(2,6,23,0.65)]">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin Control Surface</p>
          <div className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">SmartCampus Command Center</h1>
              <p className="text-slate-300 mt-2">Monitor enrolments, capacity and campus workflows from a single pane.</p>
            </div>
            {/* <div className="rounded-2xl bg-white/10 px-6 py-3 border border-white/20 text-sm">
              <p className="text-slate-300">Last sync · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-white font-semibold">All systems connected</p>
            </div> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -4 }}>
                <Card className="relative overflow-hidden bg-slate-900 text-white border border-white/10">
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_70%)]" />
                  <div className="relative flex flex-col gap-2">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.accent} flex items-center justify-center shadow-lg shadow-slate-900/40`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs uppercase tracking-wide text-black">{stat.label}</p>
                    <p className="text-3xl font-bold text-black">{stat.value}</p>
                    <p className="text-xs text-black">{stat.subtext}</p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border border-slate-100/10 bg-white/70 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Growth Lens</p>
                <h2 className="text-2xl font-bold text-slate-900">User Growth Trend</h2>
              </div>
              <span className="text-sm text-slate-500">Students vs Faculty</span>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="students" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="faculty" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="border border-slate-100/10 bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Live Feed</p>
                <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
              </div>
              <MessageSquare className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.08 }}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70"
                >
                  <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-flex" />
                    {activity.time}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </motion.div>
    </AdminLayout>
  )
}

export default AdminDashboard
