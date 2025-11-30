import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import FormInput from '../../shared/components/FormInput'
import {
  ClipboardList,
  Plus,
  FileText,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  Download,
  AlertCircle,
} from 'lucide-react'
import {
  createAssignmentAPI,
  getFacultyAssignmentsAPI,
  getAssignmentSubmissionsAPI,
  updateSubmissionStatusAPI,
} from '../../services/assignmentAPI'
import { getFacultyClassesWithSubjectsAPI } from '../../services/attendanceAPI'
import SERVERURL from '../../services/serverURL'

const FacultyAssignments = () => {
  const [activeTab, setActiveTab] = useState('my-assignments')
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [facultyClasses, setFacultyClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [saving, setSaving] = useState(false)

  // Create Assignment Form State
  const [createForm, setCreateForm] = useState({
    classId: '',
    subject: '',
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    allowedFileTypes: '',
    maxMarks: '',
    status: 'Published',
  })

  useEffect(() => {
    loadFacultyClasses()
    loadAssignments()
  }, [])

  const loadFacultyClasses = async () => {
    try {
      const res = await getFacultyClassesWithSubjectsAPI()
      if (res?.status === 200) {
        setFacultyClasses(res.data.classes || [])
      }
    } catch (error) {
      console.error('Error loading classes:', error)
    }
  }

  const loadAssignments = async () => {
    try {
      setLoading(true)
      const res = await getFacultyAssignmentsAPI()
      if (res?.status === 200) {
        setAssignments(res.data.assignments || [])
      } else {
        toast.error('Failed to load assignments')
      }
    } catch (error) {
      console.error('Error loading assignments:', error)
      toast.error(error?.response?.data?.message || 'Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const loadSubmissions = async (assignmentId) => {
    try {
      setLoadingSubmissions(true)
      const res = await getAssignmentSubmissionsAPI(assignmentId)
      if (res?.status === 200) {
        setSubmissions(res.data.submissions || [])
      } else {
        toast.error('Failed to load submissions')
      }
    } catch (error) {
      console.error('Error loading submissions:', error)
      toast.error(error?.response?.data?.message || 'Failed to load submissions')
    } finally {
      setLoadingSubmissions(false)
    }
  }

  const handleCreateFormChange = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveDraft = async () => {
    if (!createForm.title || !createForm.classId || !createForm.subject) {
      toast.error('Please fill in required fields (Title, Class, Subject)')
      return
    }

    await handleCreateAssignment('Draft')
  }

  const handlePublish = async () => {
    if (!createForm.title || !createForm.classId || !createForm.subject || !createForm.dueDate) {
      toast.error('Please fill in required fields (Title, Class, Subject, Due Date)')
      return
    }

    await handleCreateAssignment('Published')
  }

  const handleCreateAssignment = async (status) => {
    try {
      setSaving(true)
      
      // Combine date and time if time is provided
      let dueDate = createForm.dueDate
      if (createForm.dueTime) {
        dueDate = `${createForm.dueDate}T${createForm.dueTime}:00`
      } else {
        dueDate = `${createForm.dueDate}T23:59:59`
      }

      const payload = {
        title: createForm.title,
        description: createForm.description || '',
        subject: createForm.subject,
        classId: createForm.classId,
        dueDate: new Date(dueDate).toISOString(),
        status: status,
        allowedFileTypes: createForm.allowedFileTypes || 'PDF, DOC, DOCX, ZIP',
        maxMarks: createForm.maxMarks ? parseInt(createForm.maxMarks) : null,
      }

      const res = await createAssignmentAPI(payload)
      if (res?.status === 201) {
        toast.success(`Assignment ${status === 'Draft' ? 'saved as draft' : 'published successfully'}`)
        
        // Reset form
        setCreateForm({
          classId: '',
          subject: '',
          title: '',
          description: '',
          dueDate: '',
          dueTime: '',
          allowedFileTypes: '',
          maxMarks: '',
          status: 'Published',
        })
        
        // Reload assignments
        await loadAssignments()
        
        // Switch to My Assignments tab if published
        if (status === 'Published') {
          setActiveTab('my-assignments')
        }
      } else {
        toast.error(res?.response?.data?.message || 'Failed to create assignment')
      }
    } catch (error) {
      console.error('Error creating assignment:', error)
      toast.error(error?.response?.data?.message || 'Failed to create assignment')
    } finally {
      setSaving(false)
    }
  }

  const handleViewSubmissions = async (assignment) => {
    setSelectedAssignment(assignment)
    setShowSubmissionsModal(true)
    await loadSubmissions(assignment._id || assignment.id)
  }

  const handleUpdateSubmissionStatus = async (submissionId, newStatus, remark = '') => {
    try {
      const res = await updateSubmissionStatusAPI(submissionId, {
        status: newStatus,
        facultyRemark: remark,
      })
      
      if (res?.status === 200) {
        toast.success(`Submission ${newStatus.toLowerCase()}`)
        // Reload submissions
        if (selectedAssignment) {
          await loadSubmissions(selectedAssignment._id || selectedAssignment.id)
        }
        // Reload assignments to update counts
        await loadAssignments()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating submission status:', error)
      toast.error(error?.response?.data?.message || 'Failed to update status')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      Draft: 'bg-slate-100 text-slate-700',
      Published: 'bg-blue-50 text-blue-700',
      Closed: 'bg-gray-100 text-gray-700',
      Pending: 'bg-amber-50 text-amber-700',
      Approved: 'bg-emerald-50 text-emerald-700',
      Rejected: 'bg-red-50 text-red-700',
      Rework: 'bg-orange-50 text-orange-700',
    }
    return badges[status] || 'bg-slate-100 text-slate-700'
  }

  // Get available subjects for selected class
  const selectedClass = facultyClasses.find(c => (c._id || c.id) === createForm.classId)
  const availableSubjects = selectedClass?.subjects || []

  // Stats calculation
  const stats = {
    active: assignments.filter((a) => a.status === 'Published').length,
    pendingReviews: assignments.reduce((acc, a) => acc + (a.submissionsPending || 0), 0),
    completed: assignments.filter((a) => a.status === 'Closed').length,
  }

  return (
    <FacultyLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Academic & Campus</p>
            <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
            <p className="text-slate-600">Create, track and review student submissions for your classes</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
              {stats.active} Active
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold">
              {stats.pendingReviews} Pending Reviews
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Active Assignments', value: stats.active, icon: ClipboardList, color: 'from-blue-500 to-blue-600' },
            { label: 'Pending Reviews', value: stats.pendingReviews, icon: AlertCircle, color: 'from-amber-500 to-amber-600' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{stat.label}</p>
                      <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Tabs */}
        <Card>
          <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
            {[
              { id: 'my-assignments', label: 'My Assignments' },
              { id: 'create', label: 'Create Assignment' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'my-assignments' && (
              <motion.div
                key="my-assignments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500">Loading assignments...</p>
                  </div>
                ) : assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No assignments created yet</p>
                    <Button
                      variant="primary"
                      className="mt-4"
                      onClick={() => setActiveTab('create')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Assignment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => {
                      const classInfo = assignment.classId
                      return (
                        <div
                          key={assignment._id || assignment.id}
                          className="p-6 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
                                  {classInfo?.className || 'N/A'}
                                </span>
                                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                                  {assignment.subject}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(assignment.status)}`}>
                                  {assignment.status}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-2">{assignment.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{assignment.submissionsTotal || 0} submissions</span>
                                </div>
                                {(assignment.submissionsPending || 0) > 0 && (
                                  <div className="flex items-center gap-1 text-amber-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{assignment.submissionsPending} pending review</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {assignment.status === 'Published' && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleViewSubmissions(assignment)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Submissions ({assignment.submissionsTotal || 0})
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Class / Section <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={createForm.classId}
                        onChange={(e) => {
                          handleCreateFormChange('classId', e.target.value)
                          handleCreateFormChange('subject', '') // Reset subject when class changes
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      >
                        <option value="">Select a class</option>
                        {facultyClasses.map((cls) => (
                          <option key={cls._id || cls.id} value={cls._id || cls.id}>
                            {cls.className || cls.name} - {cls.department}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Subject <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={createForm.subject}
                        onChange={(e) => handleCreateFormChange('subject', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        disabled={!createForm.classId || availableSubjects.length === 0}
                        required
                      >
                        <option value="">Select a subject</option>
                        {availableSubjects.map((sub, idx) => (
                          <option key={idx} value={sub.name}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                      {createForm.classId && availableSubjects.length === 0 && (
                        <p className="text-xs text-slate-500 mt-1">No subjects available for this class</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <FormInput
                      label="Assignment Title"
                      value={createForm.title}
                      onChange={(e) => handleCreateFormChange('title', e.target.value)}
                      placeholder="e.g., Array and Linked List Assignment"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={createForm.description}
                      onChange={(e) => handleCreateFormChange('description', e.target.value)}
                      placeholder="Provide detailed instructions for the assignment..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Due Date <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        value={createForm.dueDate}
                        onChange={(e) => handleCreateFormChange('dueDate', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Due Time (Optional)
                      </label>
                      <input
                        type="time"
                        value={createForm.dueTime}
                        onChange={(e) => handleCreateFormChange('dueTime', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <FormInput
                        label="Allowed File Types (Optional)"
                        value={createForm.allowedFileTypes}
                        onChange={(e) => handleCreateFormChange('allowedFileTypes', e.target.value)}
                        placeholder="e.g., PDF, DOC, DOCX, ZIP"
                      />
                    </div>

                    <div>
                      <FormInput
                        label="Max Marks (Optional)"
                        type="number"
                        value={createForm.maxMarks}
                        onChange={(e) => handleCreateFormChange('maxMarks', e.target.value)}
                        placeholder="e.g., 100"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSaveDraft}
                      loading={saving}
                    >
                      Save as Draft
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handlePublish}
                      loading={saving}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Publish Assignment
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* View Submissions Modal */}
        <Modal
          isOpen={showSubmissionsModal}
          onClose={() => {
            setShowSubmissionsModal(false)
            setSelectedAssignment(null)
            setSubmissions([])
          }}
          title={`Submissions: ${selectedAssignment?.title}`}
          size="lg"
        >
          {selectedAssignment && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm text-slate-600">Class: {selectedAssignment.classId?.className || 'N/A'}</p>
                  <p className="text-sm text-slate-600">Subject: {selectedAssignment.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {submissions.length} Total Submissions
                  </p>
                  <p className="text-xs text-slate-500">
                    {submissions.filter((s) => s.status === 'Pending').length} Pending Review
                  </p>
                </div>
              </div>

              {loadingSubmissions ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">Loading submissions...</p>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No submissions yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Student ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Submitted On</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">File</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission) => {
                        const student = submission.studentId
                        return (
                          <tr key={submission._id || submission.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 font-medium text-slate-900">{student?.studentID || 'N/A'}</td>
                            <td className="py-3 px-4 text-slate-700">{student?.name || 'N/A'}</td>
                            <td className="py-3 px-4 text-slate-600">
                              {new Date(submission.submittedAt).toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              {submission.fileUrl ? (
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-600">{submission.fileName || 'File'}</span>
                                  <a
                                    href={`${SERVERURL}${submission.fileUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    <Download className="w-3 h-3" />
                                  </a>
                                </div>
                              ) : (
                                <span className="text-slate-400">No file</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(submission.status)}`}>
                                {submission.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {submission.status === 'Pending' && (
                                  <>
                                    <Button
                                      variant="success"
                                      size="sm"
                                      onClick={() => handleUpdateSubmissionStatus(submission._id || submission.id, 'Approved')}
                                    >
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => handleUpdateSubmissionStatus(submission._id || submission.id, 'Rejected')}
                                    >
                                      <XCircle className="w-3 h-3 mr-1" />
                                      Reject
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleUpdateSubmissionStatus(submission._id || submission.id, 'Rework')}
                                    >
                                      <RefreshCw className="w-3 h-3 mr-1" />
                                      Rework
                                    </Button>
                                  </>
                                )}
                                {submission.status !== 'Pending' && (
                                  <span className="text-xs text-slate-500">Reviewed</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </Modal>
      </motion.div>
    </FacultyLayout>
  )
}

export default FacultyAssignments
