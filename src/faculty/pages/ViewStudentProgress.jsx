import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import FormInput from '../../shared/components/FormInput'
import { ArrowLeft, Users, CheckCircle2, Clock, Lock, Eye, Download, XCircle, RefreshCw } from 'lucide-react'
import { getCourseAPI, getCourseEnrollmentsAPI, getProjectSubmissionsAPI, reviewProjectAPI } from '../../services/skillCourseAPI'
import SERVERURL from '../../services/serverURL'

const ViewStudentProgress = () => {
  const { skillId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({ status: 'Approved', feedback: '' })

  useEffect(() => {
    loadData()
  }, [skillId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [courseRes, enrollmentsRes] = await Promise.all([
        getCourseAPI(skillId),
        getCourseEnrollmentsAPI(skillId)
      ])

      if (courseRes?.status === 200) {
        setCourse(courseRes.data.course)
      }

      if (enrollmentsRes?.status === 200) {
        setEnrollments(enrollmentsRes.data.enrollments || [])
        setSubmissions(enrollmentsRes.data.submissions || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewProject = async () => {
    try {
      const res = await reviewProjectAPI(selectedSubmission._id, reviewForm.status, reviewForm.feedback)
      if (res?.status === 200) {
        toast.success(`Project ${reviewForm.status.toLowerCase()}`)
        setShowReviewModal(false)
        setSelectedSubmission(null)
        await loadData()
      } else {
        toast.error('Failed to review project')
      }
    } catch (error) {
      toast.error('Failed to review project')
    }
  }

  const getProgressPercentage = (enrollment) => {
    const progress = enrollment.progress
    let completed = 0
    if (progress.round1Completed) completed++
    if (progress.round2Completed) completed++
    if (progress.round3Approved) completed++
    if (progress.round4Completed) completed++
    return (completed / 4) * 100
  }

  const getSubmissionForStudent = (studentId) => {
    return submissions.find(s => s.student._id === studentId)
  }

  if (loading) {
    return (
      <FacultyLayout>
        <Card>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-500">Loading...</p>
          </div>
        </Card>
      </FacultyLayout>
    )
  }

  if (!course) {
    return (
      <FacultyLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-slate-500">Course not found</p>
            <Button onClick={() => navigate('/faculty/skills')} className="mt-4">Back</Button>
          </div>
        </Card>
      </FacultyLayout>
    )
  }

  return (
    <FacultyLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="secondary" onClick={() => navigate('/faculty/skills')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{course.title}</h1>
            <p className="text-slate-600">Student Enrollments & Progress</p>
          </div>
        </div>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Enrolled Students ({enrollments.length})
            </h2>

            {enrollments.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No students enrolled yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => {
                  const submission = getSubmissionForStudent(enrollment.student._id)
                  const progress = getProgressPercentage(enrollment)

                  return (
                    <div key={enrollment._id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{enrollment.student.name}</h3>
                          <p className="text-sm text-slate-600">{enrollment.student.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Progress</p>
                          <p className="text-xl font-bold text-blue-600">{Math.round(progress)}%</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className={`p-2 rounded text-center ${enrollment.progress.round1Completed ? 'bg-green-100' : 'bg-slate-100'}`}>
                          <p className="text-xs text-slate-600">Round 1</p>
                          {enrollment.progress.round1Completed ? <CheckCircle2 className="w-4 h-4 mx-auto text-green-600" /> : <Lock className="w-4 h-4 mx-auto text-slate-400" />}
                        </div>
                        <div className={`p-2 rounded text-center ${enrollment.progress.round2Completed ? 'bg-green-100' : 'bg-slate-100'}`}>
                          <p className="text-xs text-slate-600">Round 2</p>
                          {enrollment.progress.round2Completed ? (
                            <span className="text-xs font-semibold text-green-700">{enrollment.round2Score}%</span>
                          ) : <Lock className="w-4 h-4 mx-auto text-slate-400" />}
                        </div>
                        <div className={`p-2 rounded text-center ${enrollment.progress.round3Approved ? 'bg-green-100' : submission ? 'bg-yellow-100' : 'bg-slate-100'}`}>
                          <p className="text-xs text-slate-600">Round 3</p>
                          {submission && (
                            <span className="text-xs font-semibold">{submission.status}</span>
                          )}
                        </div>
                        <div className={`p-2 rounded text-center ${enrollment.progress.round4Completed ? 'bg-green-100' : 'bg-slate-100'}`}>
                          <p className="text-xs text-slate-600">Round 4</p>
                          {enrollment.progress.round4Completed ? (
                            <span className="text-xs font-semibold text-green-700">{enrollment.round4Score}%</span>
                          ) : <Lock className="w-4 h-4 mx-auto text-slate-400" />}
                        </div>
                      </div>

                      {submission && submission.status === 'Pending' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission(submission)
                            setReviewForm({ status: 'Approved', feedback: '' })
                            setShowReviewModal(true)
                          }}
                        >
                          Review Project
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Review Modal */}
        <Modal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false)
            setSelectedSubmission(null)
          }}
          title="Review Project Submission"
          size="md"
        >
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Student</p>
                <p className="font-semibold text-slate-900">{selectedSubmission.student.name}</p>
              </div>
              {selectedSubmission.description && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Description</p>
                  <p className="text-slate-700">{selectedSubmission.description}</p>
                </div>
              )}
              {selectedSubmission.projectFileUrl && (
                <div>
                  <a
                    href={`${SERVERURL}${selectedSubmission.projectFileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Project File
                  </a>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select
                  value={reviewForm.status}
                  onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Rework">Needs Rework</option>
                </select>
              </div>
              <FormInput
                label="Feedback (Optional)"
                placeholder="Provide feedback to the student..."
                value={reviewForm.feedback}
                onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                type="textarea"
                rows={3}
              />
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleReviewProject}>
                  Submit Review
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </motion.div>
    </FacultyLayout>
  )
}

export default ViewStudentProgress
