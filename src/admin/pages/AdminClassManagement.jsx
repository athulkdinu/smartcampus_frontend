import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { 
  BookOpen, 
  PlusCircle, 
  Users, 
  UserCheck, 
  GraduationCap,
  RefreshCw
} from 'lucide-react'
import {
  createClassAPI,
  getAllClassesAPI,
  getFacultyListAPI,
  assignTeacherAPI,
  assignFacultyAPI,
  assignStudentAPI,
  getClassStudentsAPI,
  getClassDetailsAPI,
  getAllUsersAPI,
} from '../../services/classAPI'
import Modal from '../../shared/components/Modal'

const AdminClassManagement = () => {
  const [activeTab, setActiveTab] = useState('create')
  const [classes, setClasses] = useState([])
  const [faculty, setFaculty] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingFaculty, setLoadingFaculty] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)

  // Create Class Form
  const [classForm, setClassForm] = useState({
    className: '',
    department: ''
  })

  // Assign Teacher Form
  const [selectedClassForTeacher, setSelectedClassForTeacher] = useState('')
  const [selectedTeacherId, setSelectedTeacherId] = useState('')

  // Assign Faculty Form
  const [selectedClassForFaculty, setSelectedClassForFaculty] = useState('')
  const [subjectForm, setSubjectForm] = useState({
    subjectName: '',
    teacherId: ''
  })

  // Manage Students Form
  const [selectedClassForStudents, setSelectedClassForStudents] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [classStudents, setClassStudents] = useState([])
  const [selectedClassDetails, setSelectedClassDetails] = useState(null)
  const [showClassDetailsModal, setShowClassDetailsModal] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    loadClasses()
    loadFaculty()
    loadStudents()
  }, [])

  const loadClasses = async () => {
    try {
      setLoading(true)
      const res = await getAllClassesAPI()
      if (res?.status === 200) {
        setClasses(res.data.classes || [])
        console.log(`✅ Loaded ${res.data.count || 0} classes`)
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

  const loadFaculty = async () => {
    try {
      setLoadingFaculty(true)
      const res = await getFacultyListAPI()
      if (res?.status === 200 && Array.isArray(res.data)) {
        setFaculty(res.data)
        console.log(`✅ Loaded ${res.data.length} faculty`)
      } else {
        toast.error('Failed to load faculty')
      }
    } catch (error) {
      console.error('Error loading faculty:', error)
      toast.error('Failed to load faculty')
    } finally {
      setLoadingFaculty(false)
    }
  }

  const loadStudents = async () => {
    try {
      setLoadingStudents(true)
      const res = await getAllUsersAPI()
      if (res?.status === 200 && res.data?.users) {
        const studentList = res.data.users.filter(u => u.role === 'student')
        setStudents(studentList)
        console.log(`✅ Loaded ${studentList.length} students`)
      }
    } catch (error) {
      console.error('Error loading students:', error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const loadClassStudents = async (classId) => {
    try {
      const res = await getClassStudentsAPI(classId)
      if (res?.status === 200) {
        setClassStudents(res.data.students || [])
      }
    } catch (error) {
      console.error('Error loading class students:', error)
      toast.error('Failed to load class students')
    }
  }

  const handleCreateClass = async (e) => {
    e.preventDefault()
    if (!classForm.className.trim() || !classForm.department.trim()) {
      toast.error('Class name and department are required')
      return
    }

    try {
      const res = await createClassAPI(classForm)
      if (res?.status === 201) {
        toast.success('Class created successfully')
        setClassForm({ className: '', department: '' })
        await loadClasses()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to create class')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create class')
    }
  }

  const handleAssignTeacher = async (e) => {
    e.preventDefault()
    if (!selectedClassForTeacher || !selectedTeacherId) {
      toast.error('Please select class and teacher')
      return
    }

    try {
      const res = await assignTeacherAPI(selectedClassForTeacher, selectedTeacherId)
      if (res?.status === 200) {
        toast.success('Class teacher assigned successfully')
        setSelectedClassForTeacher('')
        setSelectedTeacherId('')
        await loadClasses()
        await loadFaculty() // Refresh faculty list
      } else {
        toast.error(res?.response?.data?.message || 'Failed to assign teacher')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to assign teacher')
    }
  }

  const handleAssignFaculty = async (e) => {
    e.preventDefault()
    if (!selectedClassForFaculty || !subjectForm.subjectName.trim() || !subjectForm.teacherId) {
      toast.error('Please fill all fields')
      return
    }

    try {
      const res = await assignFacultyAPI(
        selectedClassForFaculty,
        subjectForm.subjectName.trim(),
        subjectForm.teacherId
      )
      if (res?.status === 200) {
        toast.success('Faculty assigned to subject successfully')
        setSubjectForm({ subjectName: '', teacherId: '' })
        await loadClasses()
        await loadFaculty() // Refresh faculty list
      } else {
        toast.error(res?.response?.data?.message || 'Failed to assign faculty')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to assign faculty')
    }
  }

  const handleViewClassDetails = async (classId) => {
    try {
      setLoadingDetails(true)
      setShowClassDetailsModal(true)
      const res = await getClassDetailsAPI(classId)
      if (res?.status === 200) {
        setSelectedClassDetails(res.data.class)
      } else {
        toast.error('Failed to load class details')
        setShowClassDetailsModal(false)
      }
    } catch (error) {
      console.error('Error loading class details:', error)
      toast.error('Failed to load class details')
      setShowClassDetailsModal(false)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleAssignStudent = async (e) => {
    e.preventDefault()
    if (!selectedClassForStudents || !selectedStudentId) {
      toast.error('Please select class and student')
      return
    }

    try {
      const res = await assignStudentAPI(selectedClassForStudents, selectedStudentId)
      if (res?.status === 200) {
        toast.success('Student assigned to class successfully')
        setSelectedStudentId('')
        await loadClassStudents(selectedClassForStudents)
        await loadClasses()
        await loadStudents() // Refresh student list
      } else {
        toast.error(res?.response?.data?.message || 'Failed to assign student')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to assign student')
    }
  }

  const tabs = [
    { id: 'create', label: 'Create Class', icon: PlusCircle },
    { id: 'teacher', label: 'Assign Class Teacher', icon: UserCheck },
    { id: 'faculty', label: 'Assign Faculties', icon: Users },
    { id: 'students', label: 'Manage Students', icon: GraduationCap },
  ]

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Academic Structure</p>
            <h1 className="text-3xl font-bold text-slate-900">Class Management</h1>
            <p className="text-slate-600 text-sm">
              Create classes, assign teachers, and manage student enrollments.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => {
            loadClasses()
            loadFaculty()
            loadStudents()
            toast.success('Data refreshed')
          }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <Card>
          <div className="flex flex-wrap gap-2 border-b border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </Card>

        {/* Tab Content */}
        <div>
          {/* Create Class Tab */}
          {activeTab === 'create' && (
            <Card>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                Create New Class
              </h2>
              <form onSubmit={handleCreateClass} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Class Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={classForm.className}
                    onChange={e => setClassForm(prev => ({ ...prev, className: e.target.value }))}
                    placeholder="e.g., CSE-2A"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Department <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={classForm.department}
                    onChange={e => setClassForm(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g., Computer Science"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <Button type="submit" variant="primary" loading={loading}>
                  Create Class
                </Button>
              </form>

              {/* Classes List */}
              <div className="mt-8">
                <h3 className="text-md font-semibold text-slate-900 mb-4">All Classes ({classes.length})</h3>
                {loading ? (
                  <p className="text-sm text-slate-500">Loading classes...</p>
                ) : classes.length === 0 ? (
                  <p className="text-sm text-slate-500">No classes created yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-2 px-3 font-semibold text-slate-600">Class</th>
                          <th className="text-left py-2 px-3 font-semibold text-slate-600">Department</th>
                          <th className="text-left py-2 px-3 font-semibold text-slate-600">Class Teacher</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classes.map((cls) => (
                          <tr 
                            key={cls._id} 
                            className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => handleViewClassDetails(cls._id)}
                          >
                            <td className="py-2 px-3 font-medium text-blue-600 hover:text-blue-700">
                              {cls.className}
                            </td>
                            <td className="py-2 px-3">{cls.department}</td>
                            <td className="py-2 px-3">
                              {cls.classTeacher ? cls.classTeacher.name : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Assign Class Teacher Tab */}
          {activeTab === 'teacher' && (
            <Card>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Assign Class Teacher
              </h2>
              <form onSubmit={handleAssignTeacher} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Select Class <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={selectedClassForTeacher}
                    onChange={e => setSelectedClassForTeacher(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">Choose a class</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>
                        {cls.className} - {cls.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Select Faculty <span className="text-red-600">*</span>
                    {loadingFaculty && <span className="ml-2 text-xs text-slate-500">(Loading...)</span>}
                    {!loadingFaculty && faculty.length > 0 && (
                      <span className="ml-2 text-xs text-slate-500">({faculty.length} available)</span>
                    )}
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={e => setSelectedTeacherId(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                    disabled={loadingFaculty}
                  >
                    <option value="">Choose a faculty</option>
                    {faculty.map(f => (
                      <option key={f.id || f._id} value={f.id || f._id}>
                        {f.name} ({f.email})
                      </option>
                    ))}
                  </select>
                  {faculty.length === 0 && !loadingFaculty && (
                    <p className="text-xs text-red-600 mt-1">No faculty available. Create faculty accounts first.</p>
                  )}
                </div>
                <Button type="submit" variant="primary" disabled={loadingFaculty}>
                  Assign Teacher
                </Button>
              </form>
            </Card>
          )}

          {/* Assign Faculties Tab */}
          {activeTab === 'faculty' && (
            <Card>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Assign Faculties to Subjects
              </h2>
              <form onSubmit={handleAssignFaculty} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Select Class <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={selectedClassForFaculty}
                    onChange={e => setSelectedClassForFaculty(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">Choose a class</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>
                        {cls.className} - {cls.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Subject Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={subjectForm.subjectName}
                    onChange={e => setSubjectForm(prev => ({ ...prev, subjectName: e.target.value }))}
                    placeholder="e.g., Mathematics"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Select Faculty <span className="text-red-600">*</span>
                    {loadingFaculty && <span className="ml-2 text-xs text-slate-500">(Loading...)</span>}
                    {!loadingFaculty && faculty.length > 0 && (
                      <span className="ml-2 text-xs text-slate-500">({faculty.length} available)</span>
                    )}
                  </label>
                  <select
                    value={subjectForm.teacherId}
                    onChange={e => setSubjectForm(prev => ({ ...prev, teacherId: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                    disabled={loadingFaculty}
                  >
                    <option value="">Choose a faculty</option>
                    {faculty.map(f => (
                      <option key={f.id || f._id} value={f.id || f._id}>
                        {f.name} ({f.email})
                      </option>
                    ))}
                  </select>
                  {faculty.length === 0 && !loadingFaculty && (
                    <p className="text-xs text-red-600 mt-1">No faculty available. Create faculty accounts first.</p>
                  )}
                </div>
                <Button type="submit" variant="primary" disabled={loadingFaculty}>
                  Assign Faculty
                </Button>
              </form>
            </Card>
          )}

          {/* Manage Students Tab */}
          {activeTab === 'students' && (
            <Card>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Manage Students
              </h2>
              <form onSubmit={handleAssignStudent} className="space-y-4 max-w-md mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Select Class <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={selectedClassForStudents}
                    onChange={async (e) => {
                      const classId = e.target.value
                      setSelectedClassForStudents(classId)
                      if (classId) {
                        await loadClassStudents(classId)
                      }
                    }}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">Choose a class</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>
                        {cls.className} - {cls.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Select Student <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                    disabled={loadingStudents}
                  >
                    <option value="">Choose a student</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" variant="primary" disabled={loadingStudents}>
                  Assign Student
                </Button>
              </form>

              {/* Class Students List */}
              {selectedClassForStudents && (
                <div className="mt-6 border-t border-slate-200 pt-6">
                  <h3 className="text-md font-semibold text-slate-900 mb-4">
                    Students in Class ({classStudents.length})
                  </h3>
                  {classStudents.length === 0 ? (
                    <p className="text-sm text-slate-500">No students assigned to this class yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-2 px-3 font-semibold text-slate-600">Name</th>
                            <th className="text-left py-2 px-3 font-semibold text-slate-600">Student ID</th>
                            <th className="text-left py-2 px-3 font-semibold text-slate-600">Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classStudents.map(stu => (
                            <tr key={stu.id || stu._id} className="border-b border-slate-100">
                              <td className="py-2 px-3">{stu.name}</td>
                              <td className="py-2 px-3">{stu.studentID || '-'}</td>
                              <td className="py-2 px-3">{stu.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Class Details Modal */}
        <Modal
          isOpen={showClassDetailsModal}
          onClose={() => {
            setShowClassDetailsModal(false)
            setSelectedClassDetails(null)
          }}
          title={selectedClassDetails ? `${selectedClassDetails.className} - Details` : 'Class Details'}
          size="lg"
        >
          {loadingDetails ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500">Loading class details...</p>
            </div>
          ) : selectedClassDetails ? (
            <div className="space-y-6">
              {/* Class Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Class Name</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedClassDetails.className}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Department</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedClassDetails.department}</p>
                </div>
              </div>

              {/* Class Teacher */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Class Teacher
                </h3>
                {selectedClassDetails.classTeacher ? (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-900">{selectedClassDetails.classTeacher.name}</p>
                    <p className="text-xs text-slate-600">{selectedClassDetails.classTeacher.email}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No class teacher assigned</p>
                )}
              </div>

              {/* Subjects & Faculty */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Subjects & Assigned Faculty
                </h3>
                {selectedClassDetails.subjects && selectedClassDetails.subjects.length > 0 ? (
                  <div className="space-y-2">
                    {selectedClassDetails.subjects.map((subject, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{subject.name}</p>
                            {subject.teacher ? (
                              <p className="text-xs text-slate-600 mt-1">
                                Faculty: {subject.teacher.name} ({subject.teacher.email})
                              </p>
                            ) : (
                              <p className="text-xs text-slate-500 italic mt-1">No faculty assigned</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No subjects assigned</p>
                )}
              </div>

              {/* Students */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Students ({selectedClassDetails.studentCount || selectedClassDetails.students?.length || 0})
                </h3>
                {selectedClassDetails.students && selectedClassDetails.students.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-white">
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-2 px-3 font-semibold text-slate-600">Name</th>
                          <th className="text-left py-2 px-3 font-semibold text-slate-600">Student ID</th>
                          <th className="text-left py-2 px-3 font-semibold text-slate-600">Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedClassDetails.students.map((stu) => (
                          <tr key={stu.id || stu._id} className="border-b border-slate-100">
                            <td className="py-2 px-3">{stu.name}</td>
                            <td className="py-2 px-3">{stu.studentID || '-'}</td>
                            <td className="py-2 px-3">{stu.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No students assigned to this class</p>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500">No class details available</p>
            </div>
          )}
        </Modal>
      </motion.div>
    </AdminLayout>
  )
}

export default AdminClassManagement

