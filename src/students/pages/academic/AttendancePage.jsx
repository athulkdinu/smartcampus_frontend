import { motion } from 'framer-motion'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { Calendar, AlertTriangle, CheckCircle2, TrendingUp, Download } from 'lucide-react'
import { attendanceData, overallAttendance } from '../../data/academicData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AttendancePage = () => {
  const lowSubjects = attendanceData.filter(item => item.percentage < 75)
  const totalClasses = attendanceData.reduce((acc, cur) => acc + cur.totalClasses, 0)

  const chartData = attendanceData.map(item => ({
    subject: item.subject.substring(0, 8),
    percentage: item.percentage
  }))

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return { bg: 'bg-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700' }
      case 'average': return { bg: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-700' }
      default: return { bg: 'bg-red-500', text: 'text-red-600', badge: 'bg-red-50 text-red-700' }
    }
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Attendance Insights</h1>
            <p className="text-slate-600">Monitor subject-wise attendance, alerts and overall trends</p>
          </div>
         
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Overall Attendance</p>
                  <p className="text-4xl font-bold text-blue-600 mb-1">{overallAttendance}%</p>
                  <p className="text-sm text-slate-500">Goal: 85% minimum</p>
                </div>
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Low Attendance</p>
                  <p className="text-4xl font-bold text-amber-600 mb-1">{lowSubjects.length}</p>
                  <p className="text-sm text-slate-500">Needs attention</p>
                </div>
                <div className="w-16 h-16 bg-amber-50 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Classes Tracked</p>
                  <p className="text-4xl font-bold text-slate-900 mb-1">{totalClasses}</p>
                  <p className="text-sm text-slate-500">Current semester</p>
                </div>
                <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-slate-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Chart */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Attendance Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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
              <Bar dataKey="percentage" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Subject Details */}
        <div className="grid grid-cols-1 gap-6">
          {attendanceData.map((item, idx) => {
            const colors = getStatusColor(item.status)
            return (
              <motion.div
                key={item.subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <Card>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${colors.badge} rounded-xl flex items-center justify-center`}>
                        <Calendar className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Subject</p>
                        <h3 className="text-xl font-bold text-slate-900">{item.subject}</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {item.attended} of {item.totalClasses} classes attended
                        </p>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-xs text-slate-500 mb-1">Percentage</p>
                      <p className={`text-4xl font-bold ${colors.text}`}>
                        {item.percentage}%
                      </p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase ${colors.badge}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                      className={`h-full rounded-full ${colors.bg}`}
                    />
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </MainLayout>
  )
}

export default AttendancePage
