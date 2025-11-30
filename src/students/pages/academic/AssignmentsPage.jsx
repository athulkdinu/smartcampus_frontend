import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Modal from '../../../shared/components/Modal'
import { FileText, Clock, Paperclip, Filter, Upload, AlertCircle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { getStudentAssignmentsAPI, submitAssignmentAPI } from '../../../services/assignmentAPI'
import SERVERURL from '../../../services/serverURL'

const AssignmentsPage = () => {
  const [filter, setFilter] = useState('all')
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [submissionFile, setSubmissionFile] = useState(null)
  const [submissionNotes, setSubmissionNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    try {
      setLoading(true)
      const res = await getStudentAssignmentsAPI()
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

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) return

    if (!submissionFile && !submissionNotes.trim()) {
      toast.error('Please upload a file or add notes')
      return
    }

    try {
      setSubmitting(true)
      const formData = new FormData()
      if (submissionFile) {
        formData.append('file', submissionFile)
      }
      if (submissionNotes.trim()) {
        formData.append('notes', submissionNotes.trim())
      }

      const res = await submitAssignmentAPI(selectedAssignment._id || selectedAssignment.id, formData)
      if (res?.status === 201) {
        toast.success('Assignment submitted successfully')
        setShowSubmitModal(false)
        setSubmissionFile(null)
        setSubmissionNotes('')
        await loadAssignments() // Reload to update submission status
      } else {
        toast.error(res?.response?.data?.message || 'Failed to submit assignment')
      }
    } catch (error) {
      console.error('Error submitting assignment:', error)
      toast.error(error?.response?.data?.message || 'Failed to submit assignment')
    } finally {
      setSubmitting(false)
    }
  }

  const getReviewStateStyles = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-50 text-green-700'
      case 'Pending':
        return 'bg-blue-50 text-blue-700'
      case 'Rework':
        return 'bg-amber-50 text-amber-700'
      case 'Rejected':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  const pending = assignments.filter(item => !item.submission || item.submission.status === 'Rework')
  const submitted = assignments.filter(item => item.submission && item.submission.status !== 'Rework')

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : filter === 'pending' 
      ? pending 
      : submitted

  const totalAttachments = assignments.filter(a => a.submission?.fileUrl).length

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
            <h1 className="text-3xl font-bold text-slate-900">Assignments Workspace</h1>
            <p className="text-slate-600">Track deliverables, due dates, attachments and faculty feedback</p>
          </div>
        </div>

        {loading ? (
          <Card className="py-10 text-center text-slate-500">
            Loading assignments...
          </Card>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Assignments', value: assignments.length, icon: FileText, color: 'from-slate-500 to-slate-600' },
                { label: 'Pending', value: pending.length, icon: AlertCircle, color: 'from-amber-500 to-amber-600' },
                { label: 'Submitted', value: submitted.length, icon: Paperclip, color: 'from-blue-500 to-blue-600' }
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

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2">
              {['all', 'pending', 'submitted'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    filter === tab
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Assignments Grid */}
            {filteredAssignments.length === 0 ? (
              <Card className="py-10 text-center text-slate-500">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p>No assignments found</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAssignments.map((assignment, idx) => {
                  const submission = assignment.submission
                  const isSubmitted = submission && submission.status !== 'Rework'
                  const dueDate = new Date(assignment.dueDate)
                  const isOverdue = dueDate < new Date() && !isSubmitted
                  const reviewStatus = submission?.status || 'Pending'
                  
                  return (
                    <motion.div
                      key={assignment._id || assignment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -4 }}
                    >
                      <Card className="h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg">
                                {assignment.subject}
                              </span>
                              {isSubmitted && (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              )}
                              {isOverdue && (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{assignment.title}</h3>
                            <p className="text-sm text-slate-600 line-clamp-2">{assignment.description || 'No description provided'}</p>
                          </div>
                        </div>

                        <div className="space-y-4 mt-auto">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-slate-500">
                              <Clock className="w-4 h-4" />
                              <span>Due: <span className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-slate-900'}`}>
                                {dueDate.toLocaleDateString()}
                              </span></span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isSubmitted
                                ? 'bg-green-50 text-green-700'
                                : isOverdue
                                ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {isSubmitted ? 'Submitted' : isOverdue ? 'Overdue' : 'Pending'}
                            </span>
                          </div>

                          {submission && (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReviewStateStyles(reviewStatus)}`}>
                                  {reviewStatus}
                                </span>
                              </div>
                              {submission.fileName && (
                                <p className="text-slate-600 text-xs">
                                  Submitted: {new Date(submission.submittedAt).toLocaleDateString()} · {submission.fileName}
                                </p>
                              )}
                              {submission.facultyRemark && (
                                <p className="text-slate-600 text-xs mt-1">
                                  <strong>Faculty Remark:</strong> {submission.facultyRemark}
                                </p>
                              )}
                            </div>
                          )}

                          <Button 
                            variant={isSubmitted ? 'secondary' : 'primary'} 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              if (!isSubmitted || submission?.status === 'Rework') {
                                setSelectedAssignment(assignment)
                                setShowSubmitModal(true)
                              }
                            }}
                          >
                            {isSubmitted ? 'View Submission' : submission?.status === 'Rework' ? 'Resubmit' : 'Submit Now'}
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Submission Modal */}
            <Modal
              isOpen={showSubmitModal}
              onClose={() => {
                setShowSubmitModal(false)
                setSelectedAssignment(null)
                setSubmissionFile(null)
                setSubmissionNotes('')
              }}
              title={`Submit: ${selectedAssignment?.title}`}
              size="md"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Upload File <span className="text-red-600">*</span>
                  </label>
                  <label className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <input
                      type="file"
                      onChange={(e) => setSubmissionFile(e.target.files[0])}
                      accept=".pdf,.doc,.docx,.zip"
                      className="hidden"
                      required
                    />
                    <Upload className="w-5 h-5 text-slate-600" />
                    <span className="text-slate-600">{submissionFile ? submissionFile.name : 'Choose file (PDF, DOC, DOCX, ZIP)'}</span>
                  </label>
                  <p className="text-xs text-slate-500 mt-1">Max 10MB. Allowed: PDF, DOC, DOCX, ZIP</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="Add any additional notes or comments..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowSubmitModal(false)
                      setSubmissionFile(null)
                      setSubmissionNotes('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSubmitAssignment}
                    loading={submitting}
                    disabled={!submissionFile}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Assignment
                  </Button>
                </div>
              </div>
            </Modal>
          </>
        )}
      </motion.div>
    </MainLayout>
  )
}

export default AssignmentsPage
