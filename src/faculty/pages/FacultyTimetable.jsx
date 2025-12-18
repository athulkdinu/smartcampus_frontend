import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import FormInput from '../../shared/components/FormInput'
import { Calendar, Plus, Edit, Trash2, Clock } from 'lucide-react'
import { getFacultyClassesAPI, getTimetableAPI, createOrUpdateTimetableAPI } from '../../services/timetableAPI'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const sessionTypes = ['Theory', 'Lab', 'Tutorial']

// Standard period timings
const periods = [
  { number: 1, startTime: '09:00', endTime: '10:00' },
  { number: 2, startTime: '10:00', endTime: '11:00' },
  { number: 3, startTime: '11:00', endTime: '12:00' },
  { number: 4, startTime: '13:00', endTime: '14:00' }, // 1:00 PM - 2:00 PM
  { number: 5, startTime: '14:00', endTime: '15:00' }, // 2:00 PM - 3:00 PM
  { number: 6, startTime: '15:00', endTime: '16:00' }  // 3:00 PM - 4:00 PM
]

const FacultyTimetable = () => {
  const [myClasses, setMyClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [timetable, setTimetable] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSlotModal, setShowSlotModal] = useState(false)
  const [editingSlot, setEditingSlot] = useState(null)
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [slotForm, setSlotForm] = useState({
    day: 'Monday',
    startTime: '',
    endTime: '',
    subject: '',
    subjectCode: '',
    room: '',
    sessionType: 'Theory',
    faculty: null
  })

  useEffect(() => {
    loadMyClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      loadTimetable(selectedClass.className)
    }
  }, [selectedClass])

  const loadMyClasses = async () => {
    try {
      setLoading(true)
      const res = await getFacultyClassesAPI()
      if (res?.status === 200) {
        setMyClasses(res.data.classes || [])
        if (res.data.classes && res.data.classes.length > 0) {
          setSelectedClass(res.data.classes[0])
        }
      } else {
        toast.error('Failed to load classes')
      }
    } catch (error) {
      console.error('Error loading classes:', error)
      toast.error('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  const loadTimetable = async (classId) => {
    try {
      const res = await getTimetableAPI(classId)
      if (res?.status === 200 && res.data.timetable) {
        setTimetable(res.data.timetable)
      } else {
        // Initialize empty timetable
        setTimetable({
          classId,
          slots: []
        })
      }
    } catch (error) {
      console.error('Error loading timetable:', error)
      setTimetable({
        classId,
        slots: []
      })
    }
  }

  const handleAddSlot = (period = null) => {
    setEditingSlot(null)
    setSelectedPeriod(period)
    if (period) {
      setSlotForm({
        day: selectedDay,
        startTime: period.startTime,
        endTime: period.endTime,
        subject: '',
        subjectCode: '',
        room: '',
        sessionType: 'Theory',
        faculty: null
      })
    } else {
      setSlotForm({
        day: selectedDay,
        startTime: '',
        endTime: '',
        subject: '',
        subjectCode: '',
        room: '',
        sessionType: 'Theory',
        faculty: null
      })
    }
    setShowSlotModal(true)
  }

  const handleEditPeriodSlot = (period, slot) => {
    setEditingSlot(slot)
    setSelectedPeriod(period)
    setSlotForm({
      day: selectedDay,
      startTime: slot.startTime,
      endTime: slot.endTime,
      subject: slot.subject,
      subjectCode: slot.subjectCode || '',
      room: slot.room || '',
      sessionType: slot.sessionType || 'Theory',
      faculty: slot.faculty?._id || null
    })
    setShowSlotModal(true)
  }

  const handleEditSlot = (slot, day) => {
    setEditingSlot(slot)
    setSlotForm({
      day: day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      subject: slot.subject,
      subjectCode: slot.subjectCode || '',
      room: slot.room || '',
      sessionType: slot.sessionType || 'Theory',
      faculty: slot.faculty?._id || null
    })
    setShowSlotModal(true)
  }

  const handleSaveSlot = async () => {
    if (!slotForm.startTime || !slotForm.endTime || !slotForm.subject) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const currentSlots = timetable?.slots || []
      let updatedSlots

      if (editingSlot) {
        // Update existing slot
        // If editing a period slot, remove any other slot for the same period and day
        updatedSlots = currentSlots
          .filter(slot => {
            // Keep all slots that are not the one being edited
            if (slot._id === editingSlot._id) return false
            // If this is a period slot, remove any slot with same day, startTime, and endTime
            if (selectedPeriod && slot.day === slotForm.day) {
              return !(slot.startTime === selectedPeriod.startTime && slot.endTime === selectedPeriod.endTime)
            }
            return true
          })
          .map(slot => slot)
        
        // Add the updated slot
        updatedSlots.push({
          ...editingSlot,
          day: slotForm.day,
          startTime: slotForm.startTime,
          endTime: slotForm.endTime,
          subject: slotForm.subject,
          subjectCode: slotForm.subjectCode || '',
          room: slotForm.room || '',
          sessionType: slotForm.sessionType,
          faculty: slotForm.faculty || null
        })
      } else {
        // Add new slot
        // If adding a period slot, remove any existing slot for the same period and day
        let filteredSlots = currentSlots
        if (selectedPeriod) {
          filteredSlots = currentSlots.filter(slot => {
            return !(slot.day === slotForm.day && 
                    slot.startTime === selectedPeriod.startTime && 
                    slot.endTime === selectedPeriod.endTime)
          })
        }
        
        updatedSlots = [
          ...filteredSlots,
          {
            day: slotForm.day,
            startTime: slotForm.startTime,
            endTime: slotForm.endTime,
            subject: slotForm.subject,
            subjectCode: slotForm.subjectCode || '',
            room: slotForm.room || '',
            sessionType: slotForm.sessionType,
            faculty: slotForm.faculty || null
          }
        ]
      }

      const res = await createOrUpdateTimetableAPI({
        classId: selectedClass.className,
        academicTerm: timetable?.academicTerm || '',
        slots: updatedSlots
      })

      if (res?.status === 201) {
        toast.success(editingSlot ? 'Slot updated' : 'Slot added')
        setShowSlotModal(false)
        setSelectedPeriod(null)
        loadTimetable(selectedClass.className)
      } else {
        toast.error(res?.response?.data?.message || 'Failed to save slot')
      }
    } catch (error) {
      console.error('Error saving slot:', error)
      toast.error('Failed to save slot')
    }
  }

  const handleDeleteSlot = async (slotId) => {
    if (!confirm('Are you sure you want to delete this slot?')) return

    try {
      const updatedSlots = timetable.slots.filter(slot => slot._id !== slotId)
      const res = await createOrUpdateTimetableAPI({
        classId: selectedClass.className,
        academicTerm: timetable?.academicTerm || '',
        slots: updatedSlots
      })

      if (res?.status === 201) {
        toast.success('Slot deleted')
        loadTimetable(selectedClass.className)
      } else {
        toast.error('Failed to delete slot')
      }
    } catch (error) {
      console.error('Error deleting slot:', error)
      toast.error('Failed to delete slot')
    }
  }

  const getSlotsForDay = (day) => {
    if (!timetable || !timetable.slots) return []
    return timetable.slots.filter(slot => slot.day === day)
  }

  const getSlotForPeriod = (day, period) => {
    const daySlots = getSlotsForDay(day)
    return daySlots.find(slot => {
      const slotStart = slot.startTime
      const slotEnd = slot.endTime
      return slotStart === period.startTime && slotEnd === period.endTime
    })
  }

  if (loading) {
    return (
      <FacultyLayout>
        <div className="p-6 text-sm text-slate-600">Loading...</div>
      </FacultyLayout>
    )
  }

  if (myClasses.length === 0) {
    return (
      <FacultyLayout>
        <Card>
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">You are not assigned to any classes</p>
          </div>
        </Card>
      </FacultyLayout>
    )
  }

  return (
    <FacultyLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Timetable Management</h1>
            <p className="text-slate-600">Create and manage class timetables</p>
          </div>
        </div>

        {/* Class Selector */}
        <Card>
          <div className="flex flex-wrap gap-2">
            {myClasses.map(cls => (
              <button
                key={cls.className}
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedClass?.className === cls.className
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cls.className}
                {cls.isClassTeacher && (
                  <span className="ml-2 text-xs opacity-75">(Class Teacher)</span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {selectedClass && (
          <>
            {/* Day Selector */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Weekly Schedule - {selectedDay}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAddSlot()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Slot
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      selectedDay === day
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Period Grid for selected day */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {periods.map(period => {
                    const slot = getSlotForPeriod(selectedDay, period)
                    return (
                      <div
                        key={period.number}
                        className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                          slot
                            ? 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                        onClick={() => {
                          if (slot) {
                            handleEditPeriodSlot(period, slot)
                          } else {
                            handleAddSlot(period)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1">Period {period.number}</p>
                            <p className="text-sm font-bold text-slate-900">
                              {period.startTime} - {period.endTime}
                            </p>
                          </div>
                          {slot ? (
                            <Edit className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Plus className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        {slot ? (
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-slate-500">Subject</p>
                              <p className="text-sm font-semibold text-slate-900">{slot.subject}</p>
                              {slot.subjectCode && (
                                <p className="text-xs text-slate-500">{slot.subjectCode}</p>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-slate-500">Room</p>
                                <p className="font-medium text-slate-700">{slot.room || 'TBD'}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Type</p>
                                <p className="font-medium text-slate-700">{slot.sessionType}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-xs text-slate-400">Click to add slot</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Additional custom slots (slots that don't match standard periods) */}
                {(() => {
                  const daySlots = getSlotsForDay(selectedDay)
                  const customSlots = daySlots.filter(slot => {
                    return !periods.some(period => 
                      period.startTime === slot.startTime && period.endTime === slot.endTime
                    )
                  })
                  
                  if (customSlots.length === 0) return null
                  
                  return (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h3 className="text-sm font-semibold text-slate-700 mb-3">Additional Slots</h3>
                      <div className="space-y-3">
                        {customSlots.map((slot, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                          >
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-slate-500">Time</p>
                                <p className="text-sm font-semibold text-slate-900">
                                  {slot.startTime} - {slot.endTime}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Subject</p>
                                <p className="text-sm font-semibold text-slate-900">{slot.subject}</p>
                                {slot.subjectCode && (
                                  <p className="text-xs text-slate-500">{slot.subjectCode}</p>
                                )}
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Room</p>
                                <p className="text-sm text-slate-700">{slot.room || 'TBD'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Type</p>
                                <p className="text-sm text-slate-700">{slot.sessionType}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditSlot(slot, selectedDay)
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteSlot(slot._id)
                                }}
                                className="text-rose-600 hover:text-rose-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Slot Modal */}
      <Modal
        isOpen={showSlotModal}
        onClose={() => {
          setShowSlotModal(false)
          setSelectedPeriod(null)
        }}
        title={editingSlot ? 'Edit Slot' : selectedPeriod ? `Add Slot - Period ${selectedPeriod.number}` : 'Add Slot'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Day</label>
            <select
              value={slotForm.day}
              onChange={(e) => setSlotForm({ ...slotForm, day: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Start Time"
              type="time"
              value={slotForm.startTime}
              onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
              required
              disabled={!!selectedPeriod}
            />
            <FormInput
              label="End Time"
              type="time"
              value={slotForm.endTime}
              onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
              required
              disabled={!!selectedPeriod}
            />
          </div>
          {selectedPeriod && (
            <p className="text-xs text-slate-500">
              Time is fixed for Period {selectedPeriod.number}
            </p>
          )}

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Subject <span className="text-red-500">*</span>
            </label>
            {selectedClass?.subjects && selectedClass.subjects.length > 0 ? (
              <>
                <select
                  value={slotForm.subject}
                  onChange={(e) => {
                    const selectedSubjectName = e.target.value
                    // Find the selected subject from the class
                    const selectedSubject = selectedClass.subjects.find(
                      sub => sub.name === selectedSubjectName
                    )
                    setSlotForm({
                      ...slotForm,
                      subject: selectedSubjectName,
                      faculty: selectedSubject?.teacher?._id || null
                    })
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  required
                >
                  <option value="">Select a subject</option>
                  {selectedClass.subjects.map((subject, idx) => (
                    <option key={idx} value={subject.name}>
                      {subject.name}
                      {subject.teacher ? ` - ${subject.teacher.name}` : ' (No faculty assigned)'}
                    </option>
                  ))}
                </select>
                {slotForm.subject && selectedClass.subjects.find(s => s.name === slotForm.subject)?.teacher && (
                  <p className="text-xs text-slate-500 mt-1">
                    Faculty: {selectedClass.subjects.find(s => s.name === slotForm.subject).teacher.name}
                  </p>
                )}
                {slotForm.subject && !selectedClass.subjects.find(s => s.name === slotForm.subject)?.teacher && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ No faculty assigned to this subject
                  </p>
                )}
              </>
            ) : (
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50">
                <p className="text-sm text-amber-700">
                  No subjects assigned to this class. Please assign subjects in Class Management first.
                </p>
              </div>
            )}
          </div>

          <FormInput
            label="Subject Code (optional)"
            value={slotForm.subjectCode}
            onChange={(e) => setSlotForm({ ...slotForm, subjectCode: e.target.value })}
            placeholder="e.g., CS301"
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Room"
              value={slotForm.room}
              onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
              placeholder="e.g., CSE-201"
            />
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Session Type</label>
              <select
                value={slotForm.sessionType}
                onChange={(e) => setSlotForm({ ...slotForm, sessionType: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {sessionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="primary" onClick={handleSaveSlot}>
              {editingSlot ? 'Update Slot' : 'Add Slot'}
            </Button>
            <Button variant="secondary" onClick={() => setShowSlotModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </FacultyLayout>
  )
}

export default FacultyTimetable

