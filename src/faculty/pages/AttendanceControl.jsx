import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { Calendar, CheckCircle2, XCircle, RefreshCcw, ChevronDown, ChevronUp, Users, Clock, BookOpen } from 'lucide-react'
import { getActiveFacultyProfile } from '../utils/getActiveFaculty'

// Dummy student data for each section
const generateStudents = (sectionName, count) => {
  const names = [
    'Aarav N', 'Diya S', 'Arjun K', 'Priya M', 'Rohan P', 'Ananya R', 'Vikram D', 'Sneha L',
    'Karan T', 'Meera J', 'Rahul S', 'Kavya B', 'Aditya V', 'Isha N', 'Neeraj K', 'Pooja M',
    'Siddharth R', 'Tanvi A', 'Aman G', 'Riya C', 'Harsh S', 'Shreya P', 'Varun M', 'Nisha K',
    'Yash D', 'Anjali T', 'Rohit B', 'Divya L', 'Akash S', 'Pallavi R', 'Sagar N', 'Kriti M',
    'Nikhil P', 'Swati K', 'Abhishek D', 'Ritika S', 'Manish T', 'Deepika A', 'Gaurav V', 'Sakshi B'
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `STU-${sectionName.replace('CSE-', '')}-${String(i + 1).padStart(3, '0')}`,
    name: names[i % names.length]
  }))
}

const AttendanceControl = () => {
  const selectedFaculty = useMemo(() => getActiveFacultyProfile(), [])
  const [expandedSections, setExpandedSections] = useState({})
  const [attendanceData, setAttendanceData] = useState({})
  const [notes, setNotes] = useState('')

  // Initialize attendance data with dummy students
  useEffect(() => {
    const initialData = {}
    selectedFaculty.sections.forEach(section => {
      const students = generateStudents(section.name, section.students)
      initialData[section.name] = {
        students: students,
        status: 'not_started', // not_started, in_progress, submitted
        attendance: students.reduce((acc, student) => {
          acc[student.id] = 'present' // default to present
          return acc
        }, {})
      }
    })
    setAttendanceData(initialData)
  }, [selectedFaculty])

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }))
    
    // Mark as in_progress when expanded
    if (!expandedSections[sectionName]) {
      setAttendanceData(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          status: 'in_progress'
        }
      }))
    }
  }

  const updateStudentAttendance = (sectionName, studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        status: 'in_progress',
        attendance: {
          ...prev[sectionName].attendance,
          [studentId]: status
        }
      }
    }))
  }

  const markAllPresent = (sectionName) => {
    const students = attendanceData[sectionName]?.students || []
    const newAttendance = students.reduce((acc, student) => {
      acc[student.id] = 'present'
      return acc
    }, {})
    
    setAttendanceData(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        status: 'in_progress',
        attendance: newAttendance
      }
    }))
    toast.success(`All students in ${sectionName} marked as present`)
  }

  const getSectionStats = (sectionName) => {
    const section = attendanceData[sectionName]
    if (!section) return { present: 0, absent: 0, excused: 0, total: 0 }
    
    const stats = { present: 0, absent: 0, excused: 0, total: section.students.length }
    Object.values(section.attendance).forEach(status => {
      if (status === 'present') stats.present++
      else if (status === 'absent') stats.absent++
      else if (status === 'excused') stats.excused++
    })
    return stats
  }

  const submitAttendance = () => {
    // Validate that all sections have attendance marked
    const hasUnmarkedSections = Object.values(attendanceData).some(
      section => section.status === 'not_started'
    )
    
    if (hasUnmarkedSections) {
      toast.error('Please mark attendance for all sections')
      return
    }

    // Mark all as submitted
    const updatedData = { ...attendanceData }
    Object.keys(updatedData).forEach(sectionName => {
      updatedData[sectionName] = {
        ...updatedData[sectionName],
        status: 'submitted'
      }
    })
    setAttendanceData(updatedData)
    
    toast.success('Attendance synced to academic server')
  }

  // Simple history snapshot (dummy data)
  const historySnapshot = [
    { date: 'Today', sections: [{ name: 'CSE-2A', present: 42, total: 46 }] },
    { date: 'Yesterday', sections: [{ name: 'CSE-2B', present: 40, total: 44 }] }
  ]

  const getStatusBadge = (status) => {
    const badges = {
      not_started: { text: 'Not started', color: 'bg-slate-100 text-slate-600' },
      in_progress: { text: 'In progress', color: 'bg-amber-100 text-amber-700' },
      submitted: { text: 'Submitted', color: 'bg-emerald-100 text-emerald-700' }
    }
    const badge = badges[status] || badges.not_started
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

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
            <h1 className="text-3xl font-bold text-slate-900">Mark attendance by student</h1>
            <p className="text-slate-600">Record individual student attendance for each section</p>
          </div>
          <Button variant="secondary">
            <Calendar className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Section Cards */}
            <div className="space-y-4">
              {selectedFaculty.sections.map((section) => {
                const sectionData = attendanceData[section.name]
                const isExpanded = expandedSections[section.name]
                const stats = getSectionStats(section.name)
                const sectionInfo = selectedFaculty.sections.find(s => s.name === section.name)

                if (!sectionData) return null

                return (
                  <Card key={section.name} className="overflow-hidden">
                    {/* Section Header */}
                    <div
                      onClick={() => toggleSection(section.name)}
                      className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{section.name}</h3>
                            {getStatusBadge(sectionData.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {selectedFaculty.subject.name}
                            </span>
                            {sectionInfo?.schedule && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {sectionInfo.schedule.split('·')[1]?.trim() || sectionInfo.schedule}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {stats.total} students
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-emerald-600 font-semibold">{stats.present}</span>
                              <span className="text-slate-300">/</span>
                              <XCircle className="w-4 h-4 text-rose-500" />
                              <span className="text-rose-600 font-semibold">{stats.absent}</span>
                              {stats.excused > 0 && (
                                <>
                                  <span className="text-slate-300">/</span>
                                  <span className="text-amber-600 font-semibold">{stats.excused} excused</span>
                                </>
                              )}
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Student List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-slate-200">
                            <div className="flex justify-between items-center mb-4 mt-4">
                              <h4 className="text-sm font-semibold text-slate-700">Student List</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAllPresent(section.name)
                                }}
                              >
                                Mark all present
                              </Button>
                            </div>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                              {sectionData.students.map((student) => {
                                const attendanceStatus = sectionData.attendance[student.id] || 'present'
                                return (
                                  <div
                                    key={student.id}
                                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                                  >
                                    <div className="flex-1">
                                      <p className="font-semibold text-slate-900">{student.name}</p>
                                      <p className="text-xs text-slate-500">{student.id}</p>
                                    </div>
                                    <select
                                      value={attendanceStatus}
                                      onChange={(e) => {
                                        e.stopPropagation()
                                        updateStudentAttendance(section.name, student.id, e.target.value)
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold outline-none transition-colors ${
                                        attendanceStatus === 'present'
                                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                          : attendanceStatus === 'absent'
                                          ? 'border-rose-200 bg-rose-50 text-rose-700'
                                          : 'border-amber-200 bg-amber-50 text-amber-700'
                                      }`}
                                    >
                                      <option value="present">Present</option>
                                      <option value="absent">Absent</option>
                                      <option value="excused">Excused</option>
                                    </select>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                )
              })}
            </div>

            {/* Notes Field */}
            <Card>
              <FormInput
                label="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Late lab, medical leave, etc."
              />
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button variant="primary" size="lg" onClick={submitAttendance}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit Attendance
              </Button>
            </div>
          </div>

          {/* History Snapshot */}
          <div>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">History Snapshot</h2>
                <RefreshCcw className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-3">
                {historySnapshot.map((snapshot, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{snapshot.date}</p>
                    <div className="space-y-2">
                      {snapshot.sections.map((section, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between text-sm text-slate-600">
                          <span>{section.name}</span>
                          <span className="font-semibold">{section.present}/{section.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </FacultyLayout>
  )
}

export default AttendanceControl

