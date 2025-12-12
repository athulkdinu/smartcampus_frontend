import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import Modal from '../../shared/components/Modal'
import { ArrowLeft, Save, Globe, FileText, Video, HelpCircle, Code, Award, Plus, X } from 'lucide-react'
import { getCourseAPI, updateCourseAPI, createOrUpdateRoundAPI } from '../../services/skillCourseAPI'

const SkillBuilder = () => {
  const { skillId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [rounds, setRounds] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeRound, setActiveRound] = useState(1)
  const [saving, setSaving] = useState(false)
  const [courseForm, setCourseForm] = useState({
    title: '',
    shortDesc: '',
    longDesc: '',
    category: 'General',
    passThreshold: 60,
    status: 'Draft'
  })
  const [roundForms, setRoundForms] = useState({
    1: { lessonTitle: '', contentType: 'text', videoUrl: '', textContent: '' },
    2: { quizTitle: '', questions: [] },
    3: { projectTitle: '', projectBrief: '', projectRequirements: [] },
    4: { quizTitle: '', questions: [] }
  })

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
        setCourseForm({
          title: res.data.course.title,
          shortDesc: res.data.course.shortDesc,
          longDesc: res.data.course.longDesc || '',
          category: res.data.course.category || 'General',
          passThreshold: res.data.course.passThreshold || 60,
          status: res.data.course.status || 'Draft'
        })

        // Load round data
        const roundData = {}
        res.data.rounds.forEach(round => {
          if (round.roundNumber === 1) {
            roundData[1] = {
              lessonTitle: round.lessonTitle || '',
              contentType: round.contentType || 'text',
              videoUrl: round.videoUrl || '',
              textContent: round.textContent || ''
            }
          } else if (round.roundNumber === 2 || round.roundNumber === 4) {
            roundData[round.roundNumber] = {
              quizTitle: round.quizTitle || '',
              questions: round.questions || []
            }
          } else if (round.roundNumber === 3) {
            roundData[3] = {
              projectTitle: round.projectTitle || '',
              projectBrief: round.projectBrief || '',
              projectRequirements: round.projectRequirements || []
            }
          }
        })
        setRoundForms(prev => ({ ...prev, ...roundData }))
      } else {
        toast.error('Failed to load course')
        navigate('/faculty/skills')
      }
    } catch (error) {
      console.error('Error loading course:', error)
      toast.error('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCourse = async () => {
    setSaving(true)
    try {
      const res = await updateCourseAPI(skillId, courseForm)
      if (res?.status === 200) {
        toast.success('Course updated')
        setCourse(res.data.course)
      } else {
        toast.error('Failed to update course')
      }
    } catch (error) {
      toast.error('Failed to update course')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveRound = async (roundNumber) => {
    setSaving(true)
    try {
      const roundData = roundForms[roundNumber]
      const payload = { roundNumber, ...roundData }
      
      const res = await createOrUpdateRoundAPI(skillId, payload)
      if (res?.status === 200) {
        toast.success(`Round ${roundNumber} saved`)
        await loadCourse()
      } else {
        toast.error('Failed to save round')
      }
    } catch (error) {
      toast.error('Failed to save round')
    } finally {
      setSaving(false)
    }
  }

  const addQuestion = (roundNumber) => {
    setRoundForms(prev => ({
      ...prev,
      [roundNumber]: {
        ...prev[roundNumber],
        questions: [...(prev[roundNumber].questions || []), { question: '', options: ['', '', '', ''], correctIndex: 0 }]
      }
    }))
  }

  const removeQuestion = (roundNumber, index) => {
    setRoundForms(prev => ({
      ...prev,
      [roundNumber]: {
        ...prev[roundNumber],
        questions: prev[roundNumber].questions.filter((_, i) => i !== index)
      }
    }))
  }

  const updateQuestion = (roundNumber, index, field, value) => {
    setRoundForms(prev => {
      const questions = [...prev[roundNumber].questions]
      questions[index] = { ...questions[index], [field]: value }
      return { ...prev, [roundNumber]: { ...prev[roundNumber], questions } }
    })
  }

  const updateOption = (roundNumber, questionIndex, optionIndex, value) => {
    setRoundForms(prev => {
      const questions = [...prev[roundNumber].questions]
      const options = [...questions[questionIndex].options]
      options[optionIndex] = value
      questions[questionIndex] = { ...questions[questionIndex], options }
      return { ...prev, [roundNumber]: { ...prev[roundNumber], questions } }
    })
  }

  const addRequirement = (roundNumber) => {
    setRoundForms(prev => ({
      ...prev,
      [roundNumber]: {
        ...prev[roundNumber],
        projectRequirements: [...(prev[roundNumber].projectRequirements || []), '']
      }
    }))
  }

  if (loading) {
    return (
      <FacultyLayout>
        <Card>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-500">Loading course...</p>
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="secondary" onClick={() => navigate('/faculty/skills')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Course</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleSaveCourse} loading={saving}>
              <Save className="w-4 h-4 mr-2" />
              Save Course
            </Button>
            {courseForm.status === 'Draft' ? (
              <Button variant="primary" onClick={() => setCourseForm({ ...courseForm, status: 'Published' })}>
                <Globe className="w-4 h-4 mr-2" />
                Publish
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setCourseForm({ ...courseForm, status: 'Draft' })}>
                <FileText className="w-4 h-4 mr-2" />
                Unpublish
              </Button>
            )}
          </div>
        </div>

        {/* Course Info */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Course Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Title"
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              required
            />
            <FormInput
              label="Category"
              value={courseForm.category}
              onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
            />
            <FormInput
              label="Short Description"
              value={courseForm.shortDesc}
              onChange={(e) => setCourseForm({ ...courseForm, shortDesc: e.target.value })}
              required
            />
            <FormInput
              label="Pass Threshold (%)"
              type="number"
              value={courseForm.passThreshold}
              onChange={(e) => setCourseForm({ ...courseForm, passThreshold: parseInt(e.target.value) || 60 })}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Long Description"
                value={courseForm.longDesc}
                onChange={(e) => setCourseForm({ ...courseForm, longDesc: e.target.value })}
                type="textarea"
                rows={4}
              />
            </div>
          </div>
        </Card>

        {/* Round Tabs */}
        <Card>
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            {[1, 2, 3, 4].map(num => {
              const icons = { 1: Video, 2: HelpCircle, 3: Code, 4: Award }
              const labels = { 1: 'Learn', 2: 'Quiz', 3: 'Project', 4: 'Final' }
              const Icon = icons[num]
              return (
                <button
                  key={num}
                  onClick={() => setActiveRound(num)}
                  className={`px-4 py-2 flex items-center gap-2 border-b-2 transition ${
                    activeRound === num
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  Round {num}: {labels[num]}
                </button>
              )
            })}
          </div>

          {/* Round 1 Content */}
          {activeRound === 1 && (
            <div className="space-y-4">
              <FormInput
                label="Lesson Title"
                value={roundForms[1].lessonTitle}
                onChange={(e) => setRoundForms({ ...roundForms, 1: { ...roundForms[1], lessonTitle: e.target.value } })}
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content Type</label>
                <select
                  value={roundForms[1].contentType}
                  onChange={(e) => setRoundForms({ ...roundForms, 1: { ...roundForms[1], contentType: e.target.value } })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                </select>
              </div>
              {roundForms[1].contentType === 'video' ? (
                <FormInput
                  label="Video URL (YouTube embed URL)"
                  placeholder="https://www.youtube.com/embed/..."
                  value={roundForms[1].videoUrl}
                  onChange={(e) => setRoundForms({ ...roundForms, 1: { ...roundForms[1], videoUrl: e.target.value } })}
                />
              ) : (
                <FormInput
                  label="Text Content"
                  value={roundForms[1].textContent}
                  onChange={(e) => setRoundForms({ ...roundForms, 1: { ...roundForms[1], textContent: e.target.value } })}
                  type="textarea"
                  rows={10}
                />
              )}
              <Button variant="primary" onClick={() => handleSaveRound(1)} loading={saving}>
                Save Round 1
              </Button>
            </div>
          )}

          {/* Round 2 & 4 Quiz */}
          {(activeRound === 2 || activeRound === 4) && (
            <div className="space-y-4">
              <FormInput
                label="Quiz Title"
                value={roundForms[activeRound].quizTitle}
                onChange={(e) => setRoundForms({ ...roundForms, [activeRound]: { ...roundForms[activeRound], quizTitle: e.target.value } })}
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Questions</h3>
                  <Button variant="secondary" size="sm" onClick={() => addQuestion(activeRound)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>
                {roundForms[activeRound].questions?.map((q, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-900">Question {idx + 1}</span>
                      <Button variant="secondary" size="sm" onClick={() => removeQuestion(activeRound, idx)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormInput
                      label="Question"
                      value={q.question}
                      onChange={(e) => updateQuestion(activeRound, idx, 'question', e.target.value)}
                    />
                    <div className="space-y-2 mt-3">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`q${idx}`}
                            checked={q.correctIndex === optIdx}
                            onChange={() => updateQuestion(activeRound, idx, 'correctIndex', optIdx)}
                            className="w-4 h-4"
                          />
                          <FormInput
                            value={opt}
                            onChange={(e) => updateOption(activeRound, idx, optIdx, e.target.value)}
                            placeholder={`Option ${optIdx + 1}`}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="primary" onClick={() => handleSaveRound(activeRound)} loading={saving}>
                Save Round {activeRound}
              </Button>
            </div>
          )}

          {/* Round 3 Project */}
          {activeRound === 3 && (
            <div className="space-y-4">
              <FormInput
                label="Project Title"
                value={roundForms[3].projectTitle}
                onChange={(e) => setRoundForms({ ...roundForms, 3: { ...roundForms[3], projectTitle: e.target.value } })}
              />
              <FormInput
                label="Project Brief"
                value={roundForms[3].projectBrief}
                onChange={(e) => setRoundForms({ ...roundForms, 3: { ...roundForms[3], projectBrief: e.target.value } })}
                type="textarea"
                rows={6}
              />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Requirements</label>
                  <Button variant="secondary" size="sm" onClick={() => addRequirement(3)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>
                <div className="space-y-2">
                  {roundForms[3].projectRequirements?.map((req, idx) => (
                    <div key={idx} className="flex gap-2">
                      <FormInput
                        value={req}
                        onChange={(e) => {
                          const requirements = [...roundForms[3].projectRequirements]
                          requirements[idx] = e.target.value
                          setRoundForms({ ...roundForms, 3: { ...roundForms[3], projectRequirements: requirements } })
                        }}
                        placeholder={`Requirement ${idx + 1}`}
                        className="flex-1"
                      />
                      <Button variant="secondary" size="sm" onClick={() => {
                        const requirements = roundForms[3].projectRequirements.filter((_, i) => i !== idx)
                        setRoundForms({ ...roundForms, 3: { ...roundForms[3], projectRequirements: requirements } })
                      }}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="primary" onClick={() => handleSaveRound(3)} loading={saving}>
                Save Round 3
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </FacultyLayout>
  )
}

export default SkillBuilder
