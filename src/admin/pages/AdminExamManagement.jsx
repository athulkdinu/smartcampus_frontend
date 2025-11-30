import { useState, useEffect, Fragment } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { BookOpen, Plus, Calendar, Clock } from 'lucide-react'
import { createExamAPI, getExamsAPI, addSubjectToExamAPI } from '../../services/examAPI'

const AdminExamManagement = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [examForm, setExamForm] = useState({
    examTitle: ''
  })
  const [subjectForms, setSubjectForms] = useState({})
  const [addingSubject, setAddingSubject] = useState({})

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

  const handleCreateExam = async (e) => {
    e.preventDefault()

    // Validate form
    if (!examForm.examTitle.trim()) {
      toast.error('Please enter an exam title')
      return
    }

    try {
      const response = await createExamAPI({ examTitle: examForm.examTitle.trim() })
      if (response?.status === 201 && response.data?.success) {
        toast.success('Exam created successfully')
        // Reload exams
        await loadExams()
        // Clear form
        setExamForm({ examTitle: '' })
      } else {
        toast.error('Failed to create exam')
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to create exam'
      toast.error(message)
    }
  }

  const handleAddSubject = async (e, examId) => {
    e.preventDefault()

    const subjectForm = subjectForms[examId] || { subjectName: '', date: '', time: '' }

    // Validate form
    if (!subjectForm.subjectName.trim() || !subjectForm.date || !subjectForm.time) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setAddingSubject(prev => ({ ...prev, [examId]: true }))
      
      // Format time for backend (convert to string format like "10:00 AM - 12:00 PM")
      const timeValue = subjectForm.time
      const [hours, minutes] = timeValue.split(':')
      const hour = parseInt(hours, 10)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const hour12 = hour % 12 || 12
      const formattedTime = `${hour12}:${minutes} ${ampm}`

      const response = await addSubjectToExamAPI(examId, {
        subjectName: subjectForm.subjectName.trim(),
        examDate: subjectForm.date,
        examTime: formattedTime
      })

      if (response?.status === 200 && response.data?.success) {
        toast.success('Subject added successfully')
        // Reload exams
        await loadExams()
        // Clear form for this exam
        setSubjectForms(prev => ({
          ...prev,
          [examId]: { subjectName: '', date: '', time: '' }
        }))
      } else {
        toast.error('Failed to add subject')
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to add subject'
      toast.error(message)
    } finally {
      setAddingSubject(prev => ({ ...prev, [examId]: false }))
    }
  }

  const handleSubjectFormChange = (examId, field, value) => {
    setSubjectForms(prev => ({
      ...prev,
      [examId]: {
        ...(prev[examId] || { subjectName: '', date: '', time: '' }),
        [field]: value
      }
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
    <AdminLayout>
      <Fragment>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-6 border border-white/10">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Exam Administration</p>
              <h1 className="text-3xl font-bold">Exam Management</h1>
              <p className="text-slate-300 mt-1">Create exams and add subjects to each exam</p>
            </div>
          </div>

          {/* Exam Creation Section */}
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Create New Exam
              </h2>
              <form onSubmit={handleCreateExam} className="space-y-4">
                <FormInput
                  label="Exam Title"
                  value={examForm.examTitle}
                  onChange={(e) => setExamForm({ examTitle: e.target.value })}
                  placeholder="e.g., Final Exam, Supplementary Exam"
                  required
                />

                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Exam
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          {/* Exams List */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Created Exams
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
                  <p className="text-slate-500">No exams created yet</p>
                  <p className="text-sm text-slate-400 mt-2">Create your first exam using the form above</p>
                </div>
              </Card>
            ) : (
              exams.map((exam, idx) => {
                const subjectForm = subjectForms[exam._id] || { subjectName: '', date: '', time: '' }
                const isAdding = addingSubject[exam._id] || false
                
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
                        <div className="pb-4 border-b border-slate-200">
                          <h3 className="text-xl font-bold text-slate-900">{exam.examTitle}</h3>
                        </div>

                        {/* Add Subject Form */}
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="text-sm font-semibold text-slate-700 mb-3">Add Subject to This Exam</h4>
                          <form onSubmit={(e) => handleAddSubject(e, exam._id)} className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <FormInput
                                label="Subject Name"
                                value={subjectForm.subjectName}
                                onChange={(e) => handleSubjectFormChange(exam._id, 'subjectName', e.target.value)}
                                placeholder="e.g., Data Structures"
                                required
                                className="bg-white"
                              />
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  Exam Date
                                </label>
                                <input
                                  type="date"
                                  value={subjectForm.date}
                                  onChange={(e) => handleSubjectFormChange(exam._id, 'date', e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  Exam Time
                                </label>
                                <input
                                  type="time"
                                  value={subjectForm.time}
                                  onChange={(e) => handleSubjectFormChange(exam._id, 'time', e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                  required
                                />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button 
                                type="submit" 
                                variant="secondary" 
                                size="sm"
                                disabled={isAdding}
                              >
                                <Plus className="w-3 h-3 mr-2" />
                                {isAdding ? 'Adding...' : 'Add Subject'}
                              </Button>
                            </div>
                          </form>
                        </div>

                        {/* Subjects Table */}
                        {exam.subjects && exam.subjects.length > 0 ? (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-3">Subjects in This Exam</h4>
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
                                      <td className="py-2 px-4 text-sm text-slate-900 font-medium">{subject.subjectName}</td>
                                      <td className="py-2 px-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                          <Calendar className="w-3 h-3 text-slate-400" />
                                          {formatDate(subject.examDate)}
                                        </div>
                                      </td>
                                      <td className="py-2 px-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                          <Clock className="w-3 h-3 text-slate-400" />
                                          {formatTime(subject.examTime)}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-slate-500 text-sm">
                            No subjects added yet. Add subjects using the form above.
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </Fragment>
    </AdminLayout>
  )
}

export default AdminExamManagement
