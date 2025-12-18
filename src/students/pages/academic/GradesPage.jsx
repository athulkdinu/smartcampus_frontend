import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { Award, Download, TrendingUp, FileText, ClipboardList, BookOpen, BarChart3 } from 'lucide-react'
import { getStudentGradesAPI } from '../../../services/gradeAPI'

const GradesPage = () => {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGrades()
  }, [])

  const loadGrades = async () => {
    try {
      setLoading(true)
      const res = await getStudentGradesAPI()
      if (res?.status === 200) {
        setGrades(res.data.grades || [])
      } else {
        toast.error('Failed to load grades')
      }
    } catch (error) {
      console.error('Error loading grades:', error)
      toast.error('Failed to load grades')
    } finally {
      setLoading(false)
    }
  }

  // Group grades by subject
  const gradesBySubject = grades.reduce((acc, grade) => {
    if (!acc[grade.subject]) {
      acc[grade.subject] = []
    }
    acc[grade.subject].push(grade)
    return acc
  }, {})

  // Calculate statistics
  const totalSubjects = Object.keys(gradesBySubject).length
  const totalAssessments = grades.length
  const gradesWithValues = grades.filter(g => g.grade && g.grade.grade)
  const avgGradeValue = gradesWithValues.length > 0
    ? gradesWithValues.reduce((sum, g) => {
        const gradeMap = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 }
        return sum + (gradeMap[g.grade.grade] || 0)
      }, 0) / gradesWithValues.length
    : 0

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
            <h1 className="text-3xl font-bold text-slate-900">Academic Grades</h1>
            <p className="text-slate-600">Subject-wise breakdown, assessments and detailed feedback</p>
          </div>
          
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Subjects', value: totalSubjects, icon: BookOpen, color: 'from-blue-500 to-blue-600' },
            { label: 'Average GPA', value: avgGradeValue.toFixed(2), icon: BarChart3, color: 'from-indigo-500 to-indigo-600' },
            { label: 'Total Assessments', value: totalAssessments, icon: ClipboardList, color: 'from-purple-500 to-purple-600' },
            { label: 'Graded', value: gradesWithValues.length, icon: Award, color: 'from-emerald-500 to-emerald-600' }
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Grades by Subject */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-slate-500">Loading grades...</p>
            </div>
          </Card>
        ) : Object.keys(gradesBySubject).length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No grades available yet</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(gradesBySubject).map(([subject, subjectGrades], idx) => {
              // Calculate overall grade for this subject (average of all assessments)
              const gradedAssessments = subjectGrades.filter(g => g.grade && g.grade.grade)
              const overallGrade = gradedAssessments.length > 0
                ? gradedAssessments[gradedAssessments.length - 1].grade.grade // Use latest grade as overall
                : 'Pending'

              return (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    {/* Subject Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Subject</p>
                          <h2 className="text-2xl font-bold text-slate-900">{subject}</h2>
                        </div>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-xs text-slate-500 mb-1">Overall Grade</p>
                        <p
                          className={
                            overallGrade === 'Pending'
                              ? 'text-2xl font-semibold text-slate-500'
                              : 'text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                          }
                        >
                          {overallGrade}
                        </p>
                      </div>
                    </div>

                    {/* Assessments List */}
                    <div className="space-y-4">
                      {subjectGrades.map((gradeItem, i) => {
                        const hasGrade = gradeItem.grade && gradeItem.grade.grade
                        const Icon = gradeItem.examType?.toLowerCase().includes('exam') ? BookOpen :
                                     gradeItem.examType?.toLowerCase().includes('quiz') ? ClipboardList : FileText

                        return (
                          <motion.div
                            key={gradeItem._id || i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (idx * 0.1) + (i * 0.05) }}
                            className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                  <Icon className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">{gradeItem.title}</p>
                                  <p className="text-xs text-slate-500">{gradeItem.examType}</p>
                                </div>
                              </div>
                              {hasGrade ? (
                                <span className="text-base font-bold text-blue-600">{gradeItem.grade.grade}</span>
                              ) : (
                                <span className="text-sm text-amber-600">Pending</span>
                              )}
                            </div>
                            {hasGrade && (
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                                <TrendingUp className="w-3 h-3" />
                                <span>
                                  {gradeItem.grade.obtainedScore} / {gradeItem.grade.maxScore} points
                                </span>
                                <span>•</span>
                                <span>Published: {new Date(gradeItem.grade.updatedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                            {!hasGrade && (
                              <p className="text-xs text-slate-400 mt-2">Grade not yet published</p>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </MainLayout>
  )
}

export default GradesPage
