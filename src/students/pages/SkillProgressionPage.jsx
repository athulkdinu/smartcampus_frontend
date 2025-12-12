import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Video, HelpCircle, Code, Award, CheckCircle2, Lock, Play, Upload, Download } from 'lucide-react'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import Modal from '../../shared/components/Modal'
import {
  getCourseAPI,
  enrollInCourseAPI,
  unenrollFromCourseAPI,
  getProgressAPI,
  completeRound1API,
  submitQuizAPI,
  submitProjectAPI,
} from '../../services/skillCourseAPI'
import SERVERURL from '../../services/serverURL'

const SkillProgressionPage = () => {
  const { skillId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [rounds, setRounds] = useState([])
  const [enrollment, setEnrollment] = useState(null)
  const [projectSubmission, setProjectSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeRound, setActiveRound] = useState(1)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [submittingQuiz, setSubmittingQuiz] = useState(false)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [projectForm, setProjectForm] = useState({ description: '', file: null })
  const [submittingProject, setSubmittingProject] = useState(false)

  useEffect(() => {
    loadCourse()
  }, [skillId])

  const loadCourse = async () => {
    setLoading(true)
    try {
      const res = await getCourseAPI(skillId)
      if (res?.status === 200) {
        setCourse(res.data.course)
        setRounds(res.data.rounds || [])
        setEnrollment(res.data.enrollment)
        if (res.data.enrollment) {
          loadProgress()
        }
      } else {
        toast.error('Failed to load course')
        navigate('/student/skills')
      }
    } catch (error) {
      console.error('Error loading course:', error)
      toast.error('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const loadProgress = async () => {
    try {
      const res = await getProgressAPI(skillId)
      if (res?.status === 200) {
        setEnrollment(res.data.enrollment)
        setProjectSubmission(res.data.projectSubmission)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const handleEnroll = async () => {
    try {
      const res = await enrollInCourseAPI(skillId)
      if (res?.status === 201) {
        toast.success('Enrolled successfully!')
        await loadCourse()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to enroll')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to enroll')
    }
  }

  const handleUnenroll = async () => {
    if (!confirm('Are you sure you want to unenroll?')) return
    try {
      const res = await unenrollFromCourseAPI(skillId)
      if (res?.status === 200) {
        toast.success('Unenrolled successfully')
        await loadCourse()
      } else {
        toast.error('Failed to unenroll')
      }
    } catch (error) {
      toast.error('Failed to unenroll')
    }
  }

  const handleCompleteRound1 = async () => {
    try {
      const res = await completeRound1API(skillId)
      if (res?.status === 200) {
        toast.success('Round 1 completed! You can now proceed to Round 2.')
        await loadProgress()
      } else {
        toast.error('Failed to complete round')
      }
    } catch (error) {
      toast.error('Failed to complete round')
    }
  }

  const handleSubmitQuiz = async (roundNumber) => {
    const round = rounds.find(r => r.roundNumber === roundNumber)
    if (!round || !round.questions) {
      toast.error('Quiz not available')
      return
    }

    const answers = round.questions.map((_, idx) => quizAnswers[idx] ?? -1)
    if (answers.some(a => a === -1)) {
      toast.error('Please answer all questions')
      return
    }

    setSubmittingQuiz(true)
    try {
      const res = await submitQuizAPI(skillId, roundNumber, answers)
      if (res?.status === 200) {
        toast.success(res.data.passed ? `Quiz passed! Score: ${res.data.score}%` : `Quiz failed. Score: ${res.data.score}%`)
        setShowQuizModal(false)
        setQuizAnswers({})
        await loadProgress()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to submit quiz')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit quiz')
    } finally {
      setSubmittingQuiz(false)
    }
  }

  const handleSubmitProject = async () => {
    if (!projectForm.file && !projectForm.description) {
      toast.error('Please upload a file or provide a description')
      return
    }

    setSubmittingProject(true)
    try {
      const formData = new FormData()
      if (projectForm.file) formData.append('projectFile', projectForm.file)
      if (projectForm.description) formData.append('description', projectForm.description)

      const res = await submitProjectAPI(skillId, formData)
      if (res?.status === 201) {
        toast.success('Project submitted successfully!')
        setProjectForm({ description: '', file: null })
        await loadProgress()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to submit project')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit project')
    } finally {
      setSubmittingProject(false)
    }
  }

  const getRoundStatus = (roundNum) => {
    if (!enrollment) return 'locked'
    const progress = enrollment.progress
    if (roundNum === 1) return progress.round1Completed ? 'completed' : 'active'
    if (roundNum === 2) {
      if (!progress.round1Completed) return 'locked'
      return progress.round2Completed ? 'completed' : 'active'
    }
    if (roundNum === 3) {
      if (!progress.round2Completed) return 'locked'
      if (projectSubmission?.status === 'Approved') return 'completed'
      return projectSubmission ? 'submitted' : 'active'
    }
    if (roundNum === 4) {
      if (!progress.round3Approved) return 'locked'
      return progress.round4Completed ? 'completed' : 'active'
    }
    return 'locked'
  }

  const getProgressPercentage = () => {
    if (!enrollment) return 0
    const progress = enrollment.progress
    let completed = 0
    if (progress.round1Completed) completed++
    if (progress.round2Completed) completed++
    if (progress.round3Approved) completed++
    if (progress.round4Completed) completed++
    return (completed / 4) * 100
  }

  if (loading) {
    return (
      <MainLayout>
        <Card>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-500">Loading course...</p>
          </div>
        </Card>
      </MainLayout>
    )
  }

  if (!course) {
    return (
      <MainLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-slate-500">Course not found</p>
            <Button onClick={() => navigate('/student/skills')} className="mt-4">Back to Courses</Button>
          </div>
        </Card>
      </MainLayout>
    )
  }

  const round1 = rounds.find(r => r.roundNumber === 1)
  const round2 = rounds.find(r => r.roundNumber === 2)
  const round3 = rounds.find(r => r.roundNumber === 3)
  const round4 = rounds.find(r => r.roundNumber === 4)

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Button variant="secondary" onClick={() => navigate('/student/skills')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{course.title}</h1>
            <p className="text-slate-600 mb-1">By {course.createdBy?.name || 'Faculty'}</p>
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
              {course.category}
            </span>
          </div>
          {enrollment ? (
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-1">Progress</p>
              <p className="text-2xl font-bold text-indigo-600">{Math.round(getProgressPercentage())}%</p>
              <Button variant="secondary" size="sm" onClick={handleUnenroll} className="mt-2">
                Unenroll
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={handleEnroll}>
              Enroll Now
        </Button>
          )}
        </div>

        {/* Progress Bar */}
        {enrollment && (
          <Card>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-600">Course Progress</span>
              <span className="font-semibold">{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </Card>
        )}

        {/* Round Stepper */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((num) => {
              const status = getRoundStatus(num)
              const round = rounds.find(r => r.roundNumber === num)
              const icons = {
                1: Video,
                2: HelpCircle,
                3: Code,
                4: Award,
              }
              const labels = {
                1: 'Learn',
                2: 'Quiz',
                3: 'Project',
                4: 'Final',
              }
              const Icon = icons[num]

            return (
                <button
                  key={num}
                  onClick={() => enrollment && status !== 'locked' && setActiveRound(num)}
                  className={`p-4 rounded-xl border-2 transition ${
                    status === 'completed'
                      ? 'border-green-500 bg-green-50'
                      : status === 'active'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 bg-slate-50 opacity-50'
                  } ${status !== 'locked' ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : status === 'locked' ? (
                      <Lock className="w-6 h-6 text-slate-400" />
                    ) : (
                      <Icon className="w-6 h-6 text-indigo-600" />
                    )}
                    <span className="font-bold text-slate-900">Round {num}</span>
                  </div>
                  <p className="text-sm text-slate-600">{labels[num]}</p>
                  {round && status === 'submitted' && (
                    <p className="text-xs text-slate-500 mt-1">Status: {projectSubmission?.status}</p>
                  )}
                </button>
            )
          })}
        </div>
        </Card>

        {/* Round Content */}
        {activeRound === 1 && round1 && (
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Round 1: Learn</h2>
            {!enrollment ? (
              <div className="space-y-4">
                <p className="text-slate-600">{course.longDesc || course.shortDesc}</p>
                <p className="text-sm text-slate-500">Enroll to access course content</p>
                <Button variant="primary" onClick={handleEnroll}>Enroll Now</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {round1.contentType === 'video' && round1.videoUrl ? (
                  <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
                    <iframe
                      src={round1.videoUrl}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700">{round1.textContent}</div>
                  </div>
                )}
                {!enrollment.progress.round1Completed && (
                  <Button variant="primary" onClick={handleCompleteRound1}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
                {enrollment.progress.round1Completed && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Round 1 Completed! You can now proceed to Round 2.
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {activeRound === 2 && round2 && (
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Round 2: Practice Quiz</h2>
            {getRoundStatus(2) === 'locked' ? (
              <div className="p-4 bg-slate-100 rounded-lg">
                <p className="text-slate-600">Complete Round 1 first to unlock this quiz.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {round2.questions && round2.questions.length > 0 ? (
                  <>
                    <p className="text-slate-600 mb-4">{round2.quizTitle || 'Practice Quiz'}</p>
                    <div className="space-y-6">
                      {round2.questions.map((q, idx) => (
                        <div key={idx} className="p-4 border border-slate-200 rounded-lg">
                          <p className="font-semibold text-slate-900 mb-3">
                            {idx + 1}. {q.question}
                          </p>
                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => (
                              <label
                                key={optIdx}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                                  quizAnswers[idx] === optIdx
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${idx}`}
                                  checked={quizAnswers[idx] === optIdx}
                                  onChange={() => setQuizAnswers({ ...quizAnswers, [idx]: optIdx })}
                                  className="w-4 h-4 text-indigo-600"
                                />
                                <span className="text-slate-700">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => handleSubmitQuiz(2)}
                      loading={submittingQuiz}
                      disabled={Object.keys(quizAnswers).length < round2.questions.length}
                    >
                      Submit Quiz
                    </Button>
                    {enrollment.progress.round2Completed && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 font-semibold">
                          Quiz Completed! Score: {enrollment.round2Score}%
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-slate-500">Quiz not available yet.</p>
                )}
              </div>
            )}
          </Card>
        )}

        {activeRound === 3 && round3 && (
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Round 3: Mini Project</h2>
            {getRoundStatus(3) === 'locked' ? (
              <div className="p-4 bg-slate-100 rounded-lg">
                <p className="text-slate-600">Complete Round 2 first to unlock this project.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">{round3.projectTitle || 'Mini Project'}</h3>
                  <div className="prose max-w-none mb-4">
                    <div className="whitespace-pre-wrap text-slate-700">{round3.projectBrief}</div>
                  </div>
                  {round3.projectRequirements && round3.projectRequirements.length > 0 && (
                    <div className="mb-4">
                      <p className="font-semibold text-slate-900 mb-2">Requirements:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        {round3.projectRequirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {projectSubmission ? (
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-900 mb-2">Submission Status: {projectSubmission.status}</p>
                    {projectSubmission.feedback && (
                      <p className="text-sm text-slate-600 mt-2">{projectSubmission.feedback}</p>
                    )}
                    {projectSubmission.projectFileUrl && (
                      <a
                        href={`${SERVERURL}${projectSubmission.projectFileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 text-sm mt-2 inline-flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Download Submission
                      </a>
                    )}
                    {projectSubmission.status === 'Rejected' || projectSubmission.status === 'Rework' ? (
                      <Button variant="primary" onClick={() => setProjectForm({ description: '', file: null })} className="mt-4">
                        Resubmit Project
                      </Button>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FormInput
                      label="Project Description"
                      placeholder="Describe your project..."
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      type="textarea"
                      rows={4}
                    />
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Upload Project File (PDF, ZIP, DOC, etc.)
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setProjectForm({ ...projectForm, file: e.target.files?.[0] || null })}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                    <Button variant="primary" onClick={handleSubmitProject} loading={submittingProject}>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Project
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {activeRound === 4 && round4 && (
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Round 4: Final Quiz</h2>
            {getRoundStatus(4) === 'locked' ? (
              <div className="p-4 bg-slate-100 rounded-lg">
                <p className="text-slate-600">Your project must be approved first to unlock this quiz.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {round4.questions && round4.questions.length > 0 ? (
                  <>
                    <p className="text-slate-600 mb-4">{round4.quizTitle || 'Final Quiz'}</p>
                    <div className="space-y-6">
                      {round4.questions.map((q, idx) => (
                        <div key={idx} className="p-4 border border-slate-200 rounded-lg">
                          <p className="font-semibold text-slate-900 mb-3">
                            {idx + 1}. {q.question}
                          </p>
                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => (
                              <label
                                key={optIdx}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                                  quizAnswers[idx + 100] === optIdx
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-final-${idx}`}
                                  checked={quizAnswers[idx + 100] === optIdx}
                                  onChange={() => setQuizAnswers({ ...quizAnswers, [idx + 100]: optIdx })}
                                  className="w-4 h-4 text-indigo-600"
                                />
                                <span className="text-slate-700">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => handleSubmitQuiz(4)}
                      loading={submittingQuiz}
                      disabled={round4.questions.some((_, idx) => quizAnswers[idx + 100] === undefined)}
                    >
                      Submit Final Quiz
                    </Button>
                    {enrollment.progress.round4Completed && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 font-semibold">
                          Course Completed! Score: {enrollment.round4Score}%
                        </p>
                        {enrollment.progress.completed && (
                          <Button variant="primary" className="mt-4">
                            <Award className="w-4 h-4 mr-2" />
                            Download Certificate
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-slate-500">Final quiz not available yet.</p>
                )}
              </div>
            )}
          </Card>
        )}
      </motion.div>
    </MainLayout>
  )
}

export default SkillProgressionPage
