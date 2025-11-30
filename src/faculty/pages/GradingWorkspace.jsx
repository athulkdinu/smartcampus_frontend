import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { ClipboardList, CheckCircle2, Save, Plus, FileText } from 'lucide-react'
import { getFacultyClassesWithSubjectsAPI } from '../../services/attendanceAPI'
import {
  generateGradeSheetAPI,
  getFacultyGradeSheetsAPI,
  getGradeSheetAPI,
  updateStudentGradeAPI
} from '../../services/gradeAPI'

const GradingWorkspace = () => {
  const [facultyClasses, setFacultyClasses] = useState([])
  const [gradeSheets, setGradeSheets] = useState([])
  const [selectedGradeSheet, setSelectedGradeSheet] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)

  const [generateForm, setGenerateForm] = useState({
    classId: '',
    subject: '',
    title: '',
    examType: ''
  })

  const [gradeForm, setGradeForm] = useState({
    maxScore: '',
    obtainedScore: '',
    grade: ''
  })

  useEffect(() => {
    loadFacultyClasses()
    loadGradeSheets()
  }, [])

  const loadFacultyClasses = async () => {
    try {
      const res = await getFacultyClassesWithSubjectsAPI()
      if (res?.status === 200) {
        setFacultyClasses(res.data.classes || [])
      }
    } catch (error) {
      console.error('Error loading classes:', error)
      toast.error('Failed to load classes')
    }
  }

  const loadGradeSheets = async () => {
    try {
      setLoading(true)
      const res = await getFacultyGradeSheetsAPI()
      if (res?.status === 200) {
        setGradeSheets(res.data.gradeSheets || [])
      } else {
        toast.error('Failed to load grade sheets')
      }
    } catch (error) {
      console.error('Error loading grade sheets:', error)
      toast.error('Failed to load grade sheets')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    
    if (!generateForm.classId || !generateForm.subject || !generateForm.title || !generateForm.examType) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setGenerating(true)
      const res = await generateGradeSheetAPI({
        classId: generateForm.classId,
        subject: generateForm.subject,
        title: generateForm.title,
        examType: generateForm.examType
      })

      if (res?.status === 201) {
        toast.success('Grade sheet generated successfully')
        setGenerateForm({ classId: '', subject: '', title: '', examType: '' })
        await loadGradeSheets()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to generate grade sheet')
      }
    } catch (error) {
      console.error('Error generating grade sheet:', error)
      toast.error(error?.response?.data?.message || 'Failed to generate grade sheet')
    } finally {
      setGenerating(false)
    }
  }

  const handleSelectGradeSheet = async (gradeSheetId) => {
    try {
      const res = await getGradeSheetAPI(gradeSheetId)
      if (res?.status === 200) {
        setSelectedGradeSheet(res.data.gradeSheet)
        setSelectedStudent(null)
        setGradeForm({ maxScore: '', obtainedScore: '', grade: '' })
      } else {
        toast.error('Failed to load grade sheet')
      }
    } catch (error) {
      console.error('Error loading grade sheet:', error)
      toast.error('Failed to load grade sheet')
    }
  }

  const handleSelectStudent = (student) => {
    setSelectedStudent(student)
    // Find student's grade if exists
    const gradeEntry = selectedGradeSheet?.grades.find(
      g => g.studentId._id.toString() === student._id.toString() || 
           g.studentId._id.toString() === student.id?.toString()
    )
    if (gradeEntry) {
      setGradeForm({
        maxScore: gradeEntry.maxScore || '',
        obtainedScore: gradeEntry.obtainedScore || '',
        grade: gradeEntry.grade || ''
      })
    } else {
      setGradeForm({ maxScore: '', obtainedScore: '', grade: '' })
    }
  }

  const handleSaveGrade = async (e) => {
    e.preventDefault()
    
    if (!selectedGradeSheet || !selectedStudent) {
      toast.error('Please select a grade sheet and student')
      return
    }

    if (!gradeForm.maxScore || !gradeForm.obtainedScore || !gradeForm.grade) {
      toast.error('Please fill in all grade fields')
      return
    }

    try {
      setSaving(true)
      const studentId = selectedStudent._id || selectedStudent.id
      const res = await updateStudentGradeAPI(selectedGradeSheet._id, studentId, {
        maxScore: parseFloat(gradeForm.maxScore),
        obtainedScore: parseFloat(gradeForm.obtainedScore),
        grade: gradeForm.grade
      })

      if (res?.status === 200) {
        toast.success('Grade saved successfully')
        // Reload the grade sheet to get updated data
        await handleSelectGradeSheet(selectedGradeSheet._id)
        setGradeForm({ maxScore: '', obtainedScore: '', grade: '' })
      } else {
        toast.error(res?.response?.data?.message || 'Failed to save grade')
      }
    } catch (error) {
      console.error('Error saving grade:', error)
      toast.error(error?.response?.data?.message || 'Failed to save grade')
    } finally {
      setSaving(false)
    }
  }

  // Get available subjects for selected class
  const selectedClass = facultyClasses.find(c => (c._id || c.id) === generateForm.classId)
  const availableSubjects = selectedClass?.subjects || []

  return (
    <FacultyLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Grading Control</p>
            <h1 className="text-3xl font-bold text-slate-900">Grading Workspace</h1>
            <p className="text-slate-600">Generate grade sheets and manage student grades</p>
          </div>
        </div>

        {/* Generate Grade Sheet Section */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Generate Grade Sheet</h2>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Class *
                </label>
                <select
                  value={generateForm.classId}
                  onChange={(e) => setGenerateForm({ ...generateForm, classId: e.target.value, subject: '' })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="">Select a class</option>
                  {facultyClasses.map((cls) => (
                    <option key={cls._id || cls.id} value={cls._id || cls.id}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Subject *
                </label>
                <select
                  value={generateForm.subject}
                  onChange={(e) => setGenerateForm({ ...generateForm, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                  disabled={!generateForm.classId}
                >
                  <option value="">Select a subject</option>
                  {availableSubjects.map((sub, idx) => (
                    <option key={idx} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={generateForm.title}
                  onChange={(e) => setGenerateForm({ ...generateForm, title: e.target.value })}
                  placeholder="e.g., Mid Term Exam"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              {/* Exam Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Exam Type *
                </label>
                <input
                  type="text"
                  value={generateForm.examType}
                  onChange={(e) => setGenerateForm({ ...generateForm, examType: e.target.value })}
                  placeholder="e.g., Mid Term, Final Exam"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" disabled={generating}>
              <Plus className="w-4 h-4 mr-2" />
              {generating ? 'Generating...' : 'Generate Grade Sheet'}
            </Button>
          </form>
        </Card>

        {/* Grade Sheets List and Student Grade Entry */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Grade Sheets List */}
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Grade Sheets</h2>
              <span className="text-sm text-slate-500">{gradeSheets.length} total</span>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Loading grade sheets...</p>
              </div>
            ) : gradeSheets.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No grade sheets created yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {gradeSheets.map((sheet) => {
                  const gradedCount = sheet.grades.filter(g => g.grade).length
                  const totalCount = sheet.grades.length
                  const isSelected = selectedGradeSheet?._id.toString() === sheet._id.toString()

                  return (
                    <motion.div
                      key={sheet._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                      onClick={() => handleSelectGradeSheet(sheet._id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">{sheet.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-slate-600 flex-wrap">
                            <span>{sheet.classId?.className || 'Unknown Class'}</span>
                            <span>•</span>
                            <span>{sheet.subject}</span>
                            <span>•</span>
                            <span>{sheet.examType}</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                          {gradedCount} / {totalCount} graded
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Created: {new Date(sheet.createdAt).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Student Grade Entry Section */}
          <div className="space-y-6">
            {selectedGradeSheet ? (
              <>
                {/* Student List */}
                <Card>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Students</h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedGradeSheet.grades.map((gradeEntry) => {
                      const student = gradeEntry.studentId
                      const studentId = student._id || student.id
                      const isSelected = selectedStudent && (
                        selectedStudent._id?.toString() === studentId.toString() ||
                        selectedStudent.id?.toString() === studentId.toString()
                      )
                      const hasGrade = !!gradeEntry.grade

                      return (
                        <div
                          key={studentId}
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : hasGrade
                                ? 'border-green-200 bg-green-50'
                                : 'border-slate-200 hover:border-slate-300'
                          }`}
                          onClick={() => handleSelectStudent(student)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900">
                                {student.name}
                              </p>
                              {student.studentID && (
                                <p className="text-xs text-slate-500">{student.studentID}</p>
                              )}
                            </div>
                            {hasGrade ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <span className="text-xs text-amber-600">Pending</span>
                            )}
                          </div>
                          {hasGrade && (
                            <p className="text-xs text-slate-600 mt-1">
                              {gradeEntry.obtainedScore} / {gradeEntry.maxScore} - {gradeEntry.grade}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </Card>

                {/* Grade Entry Form */}
                {selectedStudent && (
                  <Card>
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Enter Grade</h2>
                    <div className="mb-4 p-3 rounded-xl bg-slate-50">
                      <p className="text-sm font-semibold text-slate-900">{selectedStudent.name}</p>
                      {selectedStudent.studentID && (
                        <p className="text-xs text-slate-500">ID: {selectedStudent.studentID}</p>
                      )}
                    </div>
                    <form onSubmit={handleSaveGrade} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Max Score *
                        </label>
                        <input
                          type="number"
                          value={gradeForm.maxScore}
                          onChange={(e) => setGradeForm({ ...gradeForm, maxScore: e.target.value })}
                          placeholder="e.g., 100"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Obtained Score *
                        </label>
                        <input
                          type="number"
                          value={gradeForm.obtainedScore}
                          onChange={(e) => setGradeForm({ ...gradeForm, obtainedScore: e.target.value })}
                          placeholder="e.g., 85"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Grade *
                        </label>
                        <input
                          type="text"
                          value={gradeForm.grade}
                          onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value.toUpperCase() })}
                          placeholder="e.g., A, B+, C"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          required
                        />
                      </div>
                      <Button type="submit" variant="primary" className="w-full" disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Grade'}
                      </Button>
                    </form>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Select a grade sheet to view students</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </FacultyLayout>
  )
}

export default GradingWorkspace
