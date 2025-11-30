import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import RoundEditor from '../components/skills/RoundEditor'
import { ArrowLeft, Save, Globe, FileText, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

const SkillBuilder = () => {
  const { skillId } = useParams()
  const navigate = useNavigate()
  
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('faculty_skills')
    return saved ? JSON.parse(saved) : []
  })

  const [skill, setSkill] = useState(null)
  const [expandedRound, setExpandedRound] = useState(1)
  const [skillTitle, setSkillTitle] = useState('')
  const [published, setPublished] = useState(false)

  useEffect(() => {
    const foundSkill = skills.find(s => s.id === skillId)
    if (foundSkill) {
      setSkill(foundSkill)
      setSkillTitle(foundSkill.title)
      setPublished(foundSkill.published || false)
      // Expand first incomplete round
      const firstIncomplete = foundSkill.rounds.findIndex(r => !r.completed)
      if (firstIncomplete !== -1) {
        setExpandedRound(foundSkill.rounds[firstIncomplete].roundNumber)
      }
    } else {
      toast.error('Skill not found')
      navigate('/faculty/skills')
    }
  }, [skillId, skills, navigate])

  const isRoundLocked = (roundNumber) => {
    if (roundNumber === 1) return false
    // Check if previous round is completed
    const previousRound = skill?.rounds.find(r => r.roundNumber === roundNumber - 1)
    return !previousRound?.completed
  }

  const allRoundsCompleted = skill?.rounds.every(r => r.completed) || false

  const handleSaveRound = (roundNumber, roundData) => {
    const updatedRounds = skill.rounds.map(r => 
      r.roundNumber === roundNumber ? { ...r, ...roundData } : r
    )

    const updatedSkill = {
      ...skill,
      title: skillTitle,
      rounds: updatedRounds
    }

    const updatedSkills = skills.map(s => 
      s.id === skillId ? updatedSkill : s
    )

    setSkills(updatedSkills)
    setSkill(updatedSkill)
    localStorage.setItem('faculty_skills', JSON.stringify(updatedSkills))
    
    toast.success(`Round ${roundNumber} saved successfully!`)
    
    // Auto-expand next round if available
    if (roundNumber < 4) {
      const nextRound = roundNumber + 1
      if (!isRoundLocked(nextRound)) {
        setExpandedRound(nextRound)
      }
    }
  }

  const handleTogglePublish = () => {
    if (!allRoundsCompleted) {
      toast.error('Please complete all 4 rounds before publishing')
      return
    }

    const updatedSkill = {
      ...skill,
      title: skillTitle,
      published: !published,
      status: !published ? 'Published' : 'Draft'
    }

    const updatedSkills = skills.map(s => 
      s.id === skillId ? updatedSkill : s
    )

    setSkills(updatedSkills)
    setSkill(updatedSkill)
    setPublished(!published)
    localStorage.setItem('faculty_skills', JSON.stringify(updatedSkills))
    
    // Also update published skills in student portal
    const publishedSkills = JSON.parse(localStorage.getItem('published_skills') || '[]')
    if (!published) {
      // Add to published
      const skillForStudents = {
        id: skill.id,
        title: skillTitle,
        category: 'Programming', // Default, can be made editable
        description: `Complete ${skillTitle} skill with 4 rounds of learning`,
        difficulty: 'Intermediate',
        duration: '4 weeks',
        status: 'Published',
        startDate: 'Available Now'
      }
      const updatedPublished = [...publishedSkills.filter(s => s.id !== skill.id), skillForStudents]
      localStorage.setItem('published_skills', JSON.stringify(updatedPublished))
      toast.success('Skill published! Students can now see it in Recommended Skills.')
    } else {
      // Remove from published
      const updatedPublished = publishedSkills.filter(s => s.id !== skill.id)
      localStorage.setItem('published_skills', JSON.stringify(updatedPublished))
      toast.success('Skill unpublished')
    }
  }

  const handleSaveSkill = () => {
    const updatedSkill = {
      ...skill,
      title: skillTitle
    }

    const updatedSkills = skills.map(s => 
      s.id === skillId ? updatedSkill : s
    )

    setSkills(updatedSkills)
    setSkill(updatedSkill)
    localStorage.setItem('faculty_skills', JSON.stringify(updatedSkills))
    toast.success('Skill saved!')
  }

  if (!skill) {
    return (
      <FacultyLayout>
        <div className="text-center py-12">
          <p className="text-slate-500">Loading...</p>
        </div>
      </FacultyLayout>
    )
  }

  return (
    <FacultyLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/faculty/skills')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Skills
          </Button>
          <div className="flex items-center gap-3">
            {allRoundsCompleted && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Ready to Publish</span>
              </div>
            )}
            <Button
              variant={published ? 'secondary' : 'primary'}
              onClick={handleTogglePublish}
              disabled={!allRoundsCompleted}
              className="flex items-center gap-2"
            >
              {published ? (
                <>
                  <FileText className="w-4 h-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  Publish Skill
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Skill Title */}
        <Card>
          <div className="p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Skill Title
            </label>
            <input
              type="text"
              value={skillTitle}
              onChange={(e) => setSkillTitle(e.target.value)}
              onBlur={handleSaveSkill}
              className="w-full px-4 py-3 text-xl font-bold rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., React Development, Python Programming"
            />
            <p className="text-xs text-slate-500 mt-2">
              {published ? (
                <span className="flex items-center gap-1 text-green-600">
                  <Globe className="w-3 h-3" />
                  This skill is published and visible to students
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Draft mode - Complete all rounds to publish
                </span>
              )}
            </p>
          </div>
        </Card>

        {/* Rounds */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Learning Rounds</h2>
          {skill.rounds.map((round) => {
            const isLocked = isRoundLocked(round.roundNumber)
            const previousRound = skill.rounds.find(r => r.roundNumber === round.roundNumber - 1)
            const previousRoundCompleted = round.roundNumber === 1 || previousRound?.completed || false

            return (
              <RoundEditor
                key={round.roundNumber}
                round={round}
                isExpanded={expandedRound === round.roundNumber}
                onToggle={() => setExpandedRound(expandedRound === round.roundNumber ? null : round.roundNumber)}
                onSave={(roundData) => handleSaveRound(round.roundNumber, roundData)}
                isLocked={isLocked}
                previousRoundCompleted={previousRoundCompleted}
              />
            )
          })}
        </div>

        {/* Progress Summary */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Progress Summary</h3>
            <div className="space-y-2">
              {skill.rounds.map((round) => (
                <div key={round.roundNumber} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Round {round.roundNumber}: {round.title}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    round.completed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {round.completed ? 'Completed' : 'Incomplete'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Overall Progress
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {skill.rounds.filter(r => r.completed).length} / 4 rounds
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </FacultyLayout>
  )
}

export default SkillBuilder

