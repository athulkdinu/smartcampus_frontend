import { motion } from 'framer-motion'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { Award, Download, TrendingUp, FileText, ClipboardList, BookOpen } from 'lucide-react'
import { gradesData } from '../../data/academicData'

const GradesPage = () => {
  const categoryIcons = {
    assignments: FileText,
    quizzes: ClipboardList,
    exams: BookOpen
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Academic Grades</h1>
            <p className="text-slate-600">Subject-wise breakdown, assessments and detailed feedback</p>
          </div>
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Download Transcript
          </Button>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 gap-6">
          {gradesData.map((subject, idx) => (
            <motion.div
              key={subject.subject}
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
                      <h2 className="text-2xl font-bold text-slate-900">{subject.subject}</h2>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-xs text-slate-500 mb-1">Overall Grade</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {subject.overall}
                    </p>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['assignments', 'quizzes', 'exams'].map((category) => {
                    const Icon = categoryIcons[category]
                    return (
                      <div key={category} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-slate-600" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 capitalize">{category}</h3>
                        </div>
                        <div className="space-y-3">
                          {subject[category].map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (idx * 0.1) + (i * 0.05) }}
                              className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                <span className="text-base font-bold text-blue-600">{item.grade}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <TrendingUp className="w-3 h-3" />
                                <span>{item.obtained} / {item.maxGrade} points</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </MainLayout>
  )
}

export default GradesPage
