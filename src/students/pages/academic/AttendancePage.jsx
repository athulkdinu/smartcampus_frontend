import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import { Calendar, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { getStudentAttendanceSummaryAPI } from '../../../services/attendanceAPI'

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState({
    summary: [], // Array of subject-wise attendance
    overall: {
      totalClasses: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      percentage: 0,
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttendanceSummary()
  }, [])

  const loadAttendanceSummary = async () => {
    try {
      setLoading(true)
      const res = await getStudentAttendanceSummaryAPI()
      if (res?.status === 200) {
        setAttendanceData(res.data)
      } else {
        toast.error('Failed to load attendance summary')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load attendance summary')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (percentage) => {
    if (percentage >= 75) {
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', status: 'Good' }
    } else if (percentage >= 60) {
      return { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', status: 'Average' }
    } else {
      return { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-700', status: 'Low' }
    }
  }

  const overallStatus = getStatusColor(attendanceData.overall.percentage)

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
            <p className="text-sm uppercase tracking-wide text-slate-500">Academic & Campus</p>
            <h1 className="text-3xl font-bold text-slate-900">Attendance Insights</h1>
            <p className="text-slate-600">Monitor your subject-wise attendance and overall trends</p>
          </div>
        </div>

        {loading ? (
          <Card className="py-10 text-center text-slate-500">
            Loading attendance summary...
          </Card>
        ) : (
          <>
            {/* Overall Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Overall Attendance</p>
                      <p className={`text-4xl font-bold ${overallStatus.text} mb-1`}>
                        {attendanceData.overall.percentage}%
                      </p>
                      <p className="text-sm text-slate-500">Goal: 75% minimum</p>
                    </div>
                    <div className={`w-16 h-16 ${overallStatus.bg} rounded-xl flex items-center justify-center`}>
                      <Calendar className={`w-8 h-8 ${overallStatus.text}`} />
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
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Total Classes</p>
                      <p className="text-4xl font-bold text-slate-900 mb-1">
                        {attendanceData.overall.totalClasses}
                      </p>
                      <p className="text-sm text-slate-500">All subjects</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-blue-600" />
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
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Present</p>
                      <p className="text-4xl font-bold text-emerald-600 mb-1">
                        {attendanceData.overall.presentCount}
                      </p>
                      <p className="text-sm text-slate-500">Classes attended</p>
                    </div>
                    <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Absent</p>
                      <p className="text-4xl font-bold text-red-600 mb-1">
                        {attendanceData.overall.absentCount}
                      </p>
                      <p className="text-sm text-slate-500">Missed classes</p>
                    </div>
                    <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Subject-wise Table */}
            <Card>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Subject-wise Attendance</h2>
              {attendanceData.summary.length === 0 ? (
                <div className="py-10 text-center text-slate-500">
                  <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p>No attendance records found yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Subject</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-600">Total Classes</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-600">Present</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-600">Absent</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-600">Late</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-600">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.summary.map((subject, idx) => {
                        const subjectStatus = getStatusColor(subject.percentage)
                        return (
                          <tr
                            key={idx}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-4 px-4 font-semibold text-slate-900">{subject.subjectName}</td>
                            <td className="py-4 px-4 text-center text-slate-700">{subject.totalClasses}</td>
                            <td className="py-4 px-4 text-center">
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                <CheckCircle2 className="w-4 h-4" />
                                {subject.presentCount}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                                <XCircle className="w-4 h-4" />
                                {subject.absentCount}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                                <Clock className="w-4 h-4" />
                                {subject.lateCount}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${subjectStatus.badge}`}>
                                {subject.percentage}%
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </motion.div>
    </MainLayout>
  )
}

export default AttendancePage
