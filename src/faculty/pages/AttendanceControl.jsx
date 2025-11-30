import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { CheckCircle2, XCircle, Clock, Users, BookOpen, Save, Calendar } from 'lucide-react'
import {
  getFacultyClassesWithSubjectsAPI,
  getClassStudentsForFacultyAPI,
  getClassSubjectAttendanceAPI,
  markSubjectAttendanceAPI,
} from '../../services/attendanceAPI'

const AttendanceControl = () => {
  const [facultyClasses, setFacultyClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedSubjectName, setSelectedSubjectName] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState({}) // { studentId: 'present' | 'absent' | 'late' }
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadFacultyClasses()
  }, [])

  useEffect(() => {
    if (selectedClassId && selectedSubjectName && selectedDate) {
      loadStudentsAndAttendance()
    } else {
      setStudents([])
      setAttendanceRecords({})
    }
  }, [selectedClassId, selectedSubjectName, selectedDate])

  const loadFacultyClasses = async () => {
    try {
      setLoadingClasses(true)
      const res = await getFacultyClassesWithSubjectsAPI()
      if (res?.status === 200) {
        setFacultyClasses(res.data.classes || [])
        console.log(`✅ Loaded ${res.data.count || 0} classes with subjects for faculty`)
      } else {
        toast.error('Failed to load classes')
      }
    } catch (error) {
      console.error('Error loading faculty classes:', error)
      toast.error(error?.response?.data?.message || 'Failed to load classes')
    } finally {
      setLoadingClasses(false)
    }
  }

  const loadStudentsAndAttendance = async () => {
    if (!selectedClassId || !selectedSubjectName) return

    try {
      setLoadingStudents(true)
      setLoadingAttendance(true)

      // Load students for the class
      const studentsRes = await getClassStudentsForFacultyAPI(selectedClassId)
      if (studentsRes?.status === 200) {
        const studentList = studentsRes.data.students || []
        setStudents(studentList)

        // Initialize all as present by default
        const defaultAttendance = {}
        studentList.forEach(stu => {
          defaultAttendance[stu.id || stu._id] = 'present'
        })
        setAttendanceRecords(defaultAttendance)
      } else {
        toast.error('Failed to load students')
      }

      // Load existing attendance for this class + subject + date
      const attendanceRes = await getClassSubjectAttendanceAPI(selectedClassId, selectedSubjectName, selectedDate)
      if (attendanceRes?.status === 200 && attendanceRes.data?.records && attendanceRes.data.records.length > 0) {
        const existingRecords = {}
        attendanceRes.data.records.forEach(record => {
          const studentId = record.studentId?._id || record.studentId?.id || record.studentId
          if (studentId) {
            existingRecords[studentId] = record.status
          }
        })
        setAttendanceRecords(existingRecords)
        toast.success('Loaded existing attendance for this date')
      }
    } catch (error) {
      console.error('Error loading students/attendance:', error)
      toast.error(error?.response?.data?.message || 'Failed to load students or attendance')
    } finally {
      setLoadingStudents(false)
      setLoadingAttendance(false)
    }
  }

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const markAllPresent = () => {
    const newRecords = {}
    students.forEach(stu => {
      newRecords[stu.id || stu._id] = 'present'
    })
    setAttendanceRecords(newRecords)
    toast.success('All students marked as present')
  }

  const handleSaveAttendance = async () => {
    if (!selectedClassId || !selectedSubjectName || !selectedDate) {
      toast.error('Please select class, subject, and date')
      return
    }

    if (students.length === 0) {
      toast.error('No students to mark attendance for')
      return
    }

    try {
      setSaving(true)
      const records = students.map(stu => ({
        studentId: stu.id || stu._id,
        status: attendanceRecords[stu.id || stu._id] || 'present'
      }))

      const payload = {
        classId: selectedClassId,
        subjectName: selectedSubjectName,
        date: selectedDate,
        records
      }

      const res = await markSubjectAttendanceAPI(payload)
      if (res?.status === 200) {
        toast.success(`Attendance saved for ${selectedSubjectName}`)
      } else {
        toast.error(res?.response?.data?.message || 'Failed to save attendance')
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      toast.error(error?.response?.data?.message || 'Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  const getStats = () => {
    const total = students.length
    let present = 0
    let absent = 0
    let late = 0

    students.forEach(stu => {
      const status = attendanceRecords[stu.id || stu._id] || 'present'
      if (status === 'present') present++
      else if (status === 'absent') absent++
      else if (status === 'late') late++
    })

    return { total, present, absent, late }
  }

  const selectedClass = facultyClasses.find(c => (c._id || c.id) === selectedClassId)
  const availableSubjects = selectedClass?.subjects || []
  const stats = getStats()

  return (
    <FacultyLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Attendance Center</p>
            <h1 className="text-3xl font-bold text-slate-900">Mark Attendance</h1>
            <p className="text-slate-600">Record student attendance subject-wise for your assigned classes</p>
          </div>
        </div>

        {/* Selection Card */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Class <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedClassId}
                onChange={e => {
                  setSelectedClassId(e.target.value)
                  setSelectedSubjectName('') // Reset subject when class changes
                  setStudents([])
                  setAttendanceRecords({})
                }}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={loadingClasses}
              >
                <option value="">Choose a class</option>
                {facultyClasses.map(cls => (
                  <option key={cls._id || cls.id} value={cls._id || cls.id}>
                    {cls.className || cls.name} - {cls.department}
                  </option>
                ))}
              </select>
              {facultyClasses.length === 0 && !loadingClasses && (
                <p className="text-xs text-red-600 mt-1">No classes assigned. Contact admin.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Subject <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedSubjectName}
                onChange={e => {
                  setSelectedSubjectName(e.target.value)
                  setStudents([])
                  setAttendanceRecords({})
                }}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={!selectedClassId || availableSubjects.length === 0}
              >
                <option value="">Choose a subject</option>
                {availableSubjects.map((sub, idx) => (
                  <option key={idx} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {selectedClassId && availableSubjects.length === 0 && (
                <p className="text-xs text-slate-500 mt-1">No subjects available for this class</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
              />
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        {selectedClassId && selectedSubjectName && students.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Students</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Present</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.present}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Absent</p>
                  <p className="text-2xl font-bold text-rose-600">{stats.absent}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Late</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.late}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Students Table */}
        {selectedClassId && selectedSubjectName && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedClass?.className || selectedClass?.name} - {selectedSubjectName}
                </h2>
                <p className="text-sm text-slate-500">{selectedClass?.department}</p>
              </div>
              {students.length > 0 && (
                <Button variant="secondary" size="sm" onClick={markAllPresent}>
                  Mark All Present
                </Button>
              )}
            </div>

            {loadingStudents || loadingAttendance ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">Loading students and attendance...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="py-8 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No students in this class</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Roll / ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((stu, idx) => {
                        const studentId = stu.id || stu._id
                        const status = attendanceRecords[studentId] || 'present'
                        return (
                          <tr key={studentId} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4">{stu.studentID || `#${idx + 1}`}</td>
                            <td className="py-3 px-4 font-medium text-slate-900">{stu.name}</td>
                            <td className="py-3 px-4 text-slate-600">{stu.email}</td>
                            <td className="py-3 px-4">
                              <select
                                value={status}
                                onChange={e => handleStatusChange(studentId, e.target.value)}
                                className={`px-3 py-1.5 rounded-lg border-2 text-sm font-semibold outline-none transition-colors ${
                                  status === 'present'
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                    : status === 'absent'
                                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                                    : 'border-amber-200 bg-amber-50 text-amber-700'
                                }`}
                              >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                              </select>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSaveAttendance}
                    loading={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Attendance
                  </Button>
                </div>
              </>
            )}
          </Card>
        )}

        {(!selectedClassId || !selectedSubjectName) && (
          <Card>
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Please select a class and subject to mark attendance</p>
            </div>
          </Card>
        )}
      </motion.div>
    </FacultyLayout>
  )
}

export default AttendanceControl
