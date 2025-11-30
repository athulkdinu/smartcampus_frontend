import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { Calendar, Clock, User, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { getExamsAPI } from '../../../services/examAPI'

const ExamsPage = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedExams, setExpandedExams] = useState({})

  // Mock student info - will be replaced with API data later
  const studentInfo = {
    name: 'John Doe',
    registerNo: 'STU-2024-001',
    course: 'Computer Science',
    semester: '4'
  }

  useEffect(() => {
    loadExams()
  }, [])

  const loadExams = async () => {
    try {
      setLoading(true)
      const response = await getExamsAPI()
      if (response?.status === 200 && response.data?.success) {
        setExams(response.data.exams || [])
      } else {
        toast.error('Failed to load exams')
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load exams'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const toggleExam = (examId) => {
    setExpandedExams(prev => ({
      ...prev,
      [examId]: !prev[examId]
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A'
    // Time is already formatted from backend (e.g., "10:00 AM - 12:00 PM")
    return timeString
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">Academic & Campus</p>
          <h1 className="text-3xl font-bold text-slate-900">Exam Centre & Schedule</h1>
          <p className="text-slate-600">View your exam information and schedules</p>
        </div>

        {/* Student Information Card */}
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Student Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Name</p>
                <p className="text-sm font-semibold text-slate-900">{studentInfo.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Register No</p>
                <p className="text-sm font-semibold text-slate-900">{studentInfo.registerNo}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Course / Semester</p>
                <p className="text-sm font-semibold text-slate-900">
                  {studentInfo.course} - Semester {studentInfo.semester}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Exams Section */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Exam Schedule
          </h2>
          
          {loading ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-slate-500">Loading exams...</p>
              </div>
            </Card>
          ) : exams.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No exams scheduled</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {exams.map((exam, idx) => {
                const isExpanded = expandedExams[exam._id]
                
                return (
                  <motion.div
                    key={exam._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card>
                      <div className="space-y-4">
                        {/* Exam Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900">{exam.examTitle}</h3>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleExam(exam._id)}
                            className="flex items-center gap-2"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                Hide Timetable
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                View Timetable
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Timetable Section (Expandable) */}
                        {isExpanded && exam.subjects && exam.subjects.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-4 border-t border-slate-200"
                          >
                            <h4 className="text-sm font-semibold text-slate-900 mb-3">Exam Timetable</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="text-left py-2 px-4 text-xs font-semibold text-slate-700">Subject</th>
                                    <th className="text-left py-2 px-4 text-xs font-semibold text-slate-700">Date</th>
                                    <th className="text-left py-2 px-4 text-xs font-semibold text-slate-700">Time</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {exam.subjects.map((subject) => (
                                    <tr
                                      key={subject._id}
                                      className="border-b border-slate-100 hover:bg-slate-50"
                                    >
                                      <td className="py-3 px-4 text-sm text-slate-900 font-medium">{subject.subjectName}</td>
                                      <td className="py-3 px-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                          <Calendar className="w-4 h-4 text-slate-400" />
                                          {formatDate(subject.examDate)}
                                        </div>
                                      </td>
                                      <td className="py-3 px-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                          <Clock className="w-4 h-4 text-slate-400" />
                                          {formatTime(subject.examTime)}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        )}

                        {isExpanded && (!exam.subjects || exam.subjects.length === 0) && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="pt-4 border-t border-slate-200 text-center py-6 text-slate-500 text-sm"
                          >
                            No subjects scheduled for this exam yet.
                          </motion.div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  )
}

export default ExamsPage
