import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { ClipboardList, CheckCircle2, GaugeCircle, Trophy } from 'lucide-react'
import { gradingQueues } from '../data/facultyDemoData'
import { getActiveFacultyProfile } from '../utils/getActiveFaculty'

const GradingWorkspace = () => {
  const selectedFaculty = useMemo(() => getActiveFacultyProfile(), [])
  const [gradeForm, setGradeForm] = useState({
    studentId: 'STU-1034',
    assessment: 'Lab 05',
    score: '18',
    maxScore: '20'
  })

  const gradingCompletion = Math.round(
    (selectedFaculty.stats.students - selectedFaculty.stats.pendingGrading) / selectedFaculty.stats.students * 100
  )

  const handleGradeSubmit = (e) => {
    e.preventDefault()
    toast.success(`Grade saved for ${gradeForm.studentId}`)
  }

  return (
    <FacultyLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Grading Control</p>
            <h1 className="text-3xl font-bold text-slate-900">Validate submissions & publish scores</h1>
            <p className="text-slate-600">Live queue of assessments across sections for {selectedFaculty.subject.name}.</p>
          </div>
          <Button variant="primary">
            <ClipboardList className="w-4 h-4 mr-2" />
            Generate Grade Sheet
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Pending Assessment Queue</h2>
              <span className="text-sm text-slate-500">Track, grade, and publish</span>
            </div>
            <div className="space-y-4">
              {gradingQueues.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 rounded-2xl border border-slate-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{item.section}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                      Due {item.due}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item.submissions - item.pending} graded
                    <span className="text-slate-300">/</span>
                    <GaugeCircle className="w-4 h-4 text-amber-500" />
                    {item.pending} pending
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Grade Entry</h2>
              <form onSubmit={handleGradeSubmit} className="space-y-4">
                <FormInput
                  label="Student ID"
                  value={gradeForm.studentId}
                  onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
                />
                <FormInput
                  label="Assessment"
                  value={gradeForm.assessment}
                  onChange={(e) => setGradeForm({ ...gradeForm, assessment: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    label="Score"
                    value={gradeForm.score}
                    onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                  />
                  <FormInput
                    label="Max"
                    value={gradeForm.maxScore}
                    onChange={(e) => setGradeForm({ ...gradeForm, maxScore: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Save grade
                </Button>
              </form>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-10 h-10 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-500">Completion</p>
                  <p className="text-2xl font-bold text-slate-900">{gradingCompletion}%</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                {selectedFaculty.stats.pendingGrading} submissions remain. Keep the queue moving to stay ahead of deadlines.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </FacultyLayout>
  )
}

export default GradingWorkspace

