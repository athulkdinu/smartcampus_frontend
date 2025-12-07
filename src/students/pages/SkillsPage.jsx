import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import FormInput from '../../shared/components/FormInput'
import SkillSummaryCards from '../components/skills/SkillSummaryCards'
import SkillCards from '../components/skills/SkillCards'
import RecommendedSkills from '../components/skills/RecommendedSkills'
import { Plus, CheckCircle2, XCircle, Clock, FileText, ExternalLink } from 'lucide-react'
import { submitSkillAPI, getMySkillsAPI } from '../../services/skillAPI'

const SkillsPage = () => {
  const navigate = useNavigate()
  
  // Mock skills data with rounds structure
  const [skills, setSkills] = useState([
    {
      id: '1',
      name: 'Python Programming',
      category: 'Programming',
      status: 'In Progress',
      currentRound: 2,
      totalRounds: 4,
      progress: 50,
      rounds: [
        {
          roundNumber: 1,
          title: 'Basics & Fundamentals',
          tasks: [
            { id: '1-1', title: 'Complete Python syntax basics', description: 'Learn variables, data types, and operators', completed: true },
            { id: '1-2', title: 'Practice with loops and conditionals', description: 'Write 10 practice programs', completed: true },
            { id: '1-3', title: 'Build a calculator project', description: 'Create a simple calculator using Python', completed: true }
          ]
        },
        {
          roundNumber: 2,
          title: 'Practice & Exercises',
          tasks: [
            { id: '2-1', title: 'Learn functions and modules', description: 'Understand function definitions and imports', completed: true },
            { id: '2-2', title: 'Work with file operations', description: 'Read and write files in Python', completed: false },
            { id: '2-3', title: 'Complete 5 coding challenges', description: 'Solve problems on HackerRank', completed: false }
          ]
        },
        {
          roundNumber: 3,
          title: 'Project Development',
          tasks: [
            { id: '3-1', title: 'Design a project plan', description: 'Plan your Python project', completed: false },
            { id: '3-2', title: 'Implement core features', description: 'Build main functionality', completed: false },
            { id: '3-3', title: 'Add error handling', description: 'Implement try-except blocks', completed: false }
          ]
        },
        {
          roundNumber: 4,
          title: 'Final Test & Certification',
          tasks: [
            { id: '4-1', title: 'Take final assessment', description: 'Complete the skill assessment test', completed: false },
            { id: '4-2', title: 'Submit project for review', description: 'Get your project reviewed by mentor', completed: false },
            { id: '4-3', title: 'Earn certificate', description: 'Receive your completion certificate', completed: false }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'React Development',
      category: 'Web Development',
      status: 'In Progress',
      currentRound: 1,
      totalRounds: 4,
      progress: 25,
      rounds: [
        {
          roundNumber: 1,
          title: 'React Fundamentals',
          tasks: [
            { id: '2-1-1', title: 'Learn JSX and components', description: 'Understand React component structure', completed: true },
            { id: '2-1-2', title: 'Practice with props and state', description: 'Build components with dynamic data', completed: false },
            { id: '2-1-3', title: 'Complete React tutorial', description: 'Finish official React tutorial', completed: false }
          ]
        },
        {
          roundNumber: 2,
          title: 'Hooks & State Management',
          tasks: [
            { id: '2-2-1', title: 'Master useState and useEffect', description: 'Learn React hooks', completed: false },
            { id: '2-2-2', title: 'Implement Context API', description: 'Build app with context', completed: false },
            { id: '2-2-3', title: 'Learn custom hooks', description: 'Create reusable hooks', completed: false }
          ]
        },
        {
          roundNumber: 3,
          title: 'Advanced Concepts',
          tasks: [
            { id: '2-3-1', title: 'Learn React Router', description: 'Implement routing', completed: false },
            { id: '2-3-2', title: 'State management with Redux', description: 'Integrate Redux', completed: false },
            { id: '2-3-3', title: 'Performance optimization', description: 'Optimize React apps', completed: false }
          ]
        },
        {
          roundNumber: 4,
          title: 'Final Project',
          tasks: [
            { id: '2-4-1', title: 'Build a full-stack app', description: 'Create complete React application', completed: false },
            { id: '2-4-2', title: 'Deploy to production', description: 'Deploy your React app', completed: false },
            { id: '2-4-3', title: 'Get certified', description: 'Receive React developer certificate', completed: false }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'UI/UX Design',
      category: 'Design',
      status: 'Completed',
      currentRound: 4,
      totalRounds: 4,
      progress: 100,
      rounds: [
        {
          roundNumber: 1,
          title: 'Design Principles',
          tasks: [
            { id: '3-1-1', title: 'Learn design fundamentals', description: 'Study color theory and typography', completed: true },
            { id: '3-1-2', title: 'Practice with design tools', description: 'Master Figma basics', completed: true },
            { id: '3-1-3', title: 'Create mood boards', description: 'Design inspiration boards', completed: true }
          ]
        },
        {
          roundNumber: 2,
          title: 'User Research',
          tasks: [
            { id: '3-2-1', title: 'Conduct user interviews', description: 'Interview 5 users', completed: true },
            { id: '3-2-2', title: 'Create user personas', description: 'Build persona profiles', completed: true },
            { id: '3-2-3', title: 'Design user journey maps', description: 'Map user flows', completed: true }
          ]
        },
        {
          roundNumber: 3,
          title: 'Prototyping',
          tasks: [
            { id: '3-3-1', title: 'Create wireframes', description: 'Design low-fidelity prototypes', completed: true },
            { id: '3-3-2', title: 'Build high-fidelity designs', description: 'Create detailed mockups', completed: true },
            { id: '3-3-3', title: 'Prototype interactions', description: 'Add animations and transitions', completed: true }
          ]
        },
        {
          roundNumber: 4,
          title: 'Portfolio & Certification',
          tasks: [
            { id: '3-4-1', title: 'Build design portfolio', description: 'Showcase your work', completed: true },
            { id: '3-4-2', title: 'Present to design team', description: 'Get feedback on portfolio', completed: true },
            { id: '3-4-3', title: 'Earn UI/UX certificate', description: 'Receive completion certificate', completed: true }
          ]
        }
      ]
    },
    {
      id: '4',
      name: 'Data Structures & Algorithms',
      category: 'Computer Science',
      status: 'Not Started',
      currentRound: 0,
      totalRounds: 4,
      progress: 0,
      rounds: [
        {
          roundNumber: 1,
          title: 'Introduction to DSA',
          tasks: [
            { id: '4-1-1', title: 'Learn basic data structures', description: 'Arrays, linked lists, stacks, queues', completed: false },
            { id: '4-1-2', title: 'Understand time complexity', description: 'Big O notation basics', completed: false },
            { id: '4-1-3', title: 'Solve 10 easy problems', description: 'Practice on LeetCode', completed: false }
          ]
        },
        {
          roundNumber: 2,
          title: 'Intermediate Algorithms',
          tasks: [
            { id: '4-2-1', title: 'Master sorting algorithms', description: 'Quick sort, merge sort, etc.', completed: false },
            { id: '4-2-2', title: 'Learn tree structures', description: 'Binary trees, BST, AVL', completed: false },
            { id: '4-2-3', title: 'Solve 20 medium problems', description: 'LeetCode medium challenges', completed: false }
          ]
        },
        {
          roundNumber: 3,
          title: 'Advanced Topics',
          tasks: [
            { id: '4-3-1', title: 'Graph algorithms', description: 'DFS, BFS, shortest paths', completed: false },
            { id: '4-3-2', title: 'Dynamic programming', description: 'DP patterns and problems', completed: false },
            { id: '4-3-3', title: 'Solve 15 hard problems', description: 'Advanced LeetCode challenges', completed: false }
          ]
        },
        {
          roundNumber: 4,
          title: 'Final Assessment',
          tasks: [
            { id: '4-4-1', title: 'Take DSA assessment', description: 'Complete final test', completed: false },
            { id: '4-4-2', title: 'System design basics', description: 'Learn system design principles', completed: false },
            { id: '4-4-3', title: 'Get DSA certificate', description: 'Receive completion certificate', completed: false }
          ]
        }
      ]
    }
  ])

  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    certificates: 0,
    learningHours: '142h / 2,450 XP'
  })

  // Skill submissions state
  const [submittedSkills, setSubmittedSkills] = useState([])
  const [loadingSkills, setLoadingSkills] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newSkill, setNewSkill] = useState({
    title: '',
    provider: '',
    certificateUrl: ''
  })

  // Load submitted skills
  useEffect(() => {
    loadSubmittedSkills()
  }, [])

  const loadSubmittedSkills = async () => {
    try {
      setLoadingSkills(true)
      const res = await getMySkillsAPI()
      if (res?.status === 200) {
        setSubmittedSkills(res.data.skills || [])
        // Update certificates count
        const approvedCount = (res.data.skills || []).filter(s => s.status === 'approved').length
        setStats(prev => ({
          ...prev,
          certificates: approvedCount
        }))
      }
    } catch (error) {
      console.error('Error loading submitted skills:', error)
    } finally {
      setLoadingSkills(false)
    }
  }

  const handleSubmitSkill = async (e) => {
    e.preventDefault()
    if (!newSkill.title.trim()) {
      toast.error('Please enter a skill title')
      return
    }

    try {
      setSubmitting(true)
      const res = await submitSkillAPI({
        title: newSkill.title,
        provider: newSkill.provider || null,
        certificateUrl: newSkill.certificateUrl || null
      })

      if (res?.status === 201) {
        toast.success('Skill submitted successfully')
        setShowAddModal(false)
        setNewSkill({ title: '', provider: '', certificateUrl: '' })
        await loadSubmittedSkills()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to submit skill')
      }
    } catch (error) {
      console.error('Error submitting skill:', error)
      toast.error(error?.response?.data?.message || 'Failed to submit skill')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
    }
  }

  // Calculate stats from skills
  useEffect(() => {
    const completed = skills.filter(s => s.status === 'Completed').length
    const inProgress = skills.filter(s => s.status === 'In Progress').length
    
    setStats(prev => ({
      completed,
      inProgress,
      certificates: prev.certificates, // Updated from submitted skills
      learningHours: '142h / 2,450 XP'
    }))
  }, [skills])

  const handleContinue = (skillId) => {
    // Navigate to skill progression page
    navigate(`/student/skills/${skillId}`)
  }


  const handleStatCardClick = (label) => {
    // Future: Filter skills based on stat clicked
    console.log('Clicked stat:', label)
  }

  const handleEnroll = (skillId) => {
    // Future: Handle enrollment
    console.log('Enroll in skill:', skillId)
  }

  // Recommended skills - load from published skills (faculty published) + default mock data
  const [recommendedSkills, setRecommendedSkills] = useState(() => {
    // Load published skills from localStorage
    const publishedSkills = JSON.parse(localStorage.getItem('published_skills') || '[]')
    
    // Default mock skills as fallback
    const defaultSkills = [
      {
        id: 'rec-1',
        title: 'Machine Learning Basics',
        category: 'AI/ML',
        description: 'Learn the fundamentals of machine learning and build your first ML models',
        difficulty: 'Intermediate',
        duration: '6 weeks',
        status: 'Published',
        startDate: 'Available Now'
      },
      {
        id: 'rec-2',
        title: 'Cloud Computing with AWS',
        category: 'Technology',
        description: 'Master cloud infrastructure and deploy scalable applications on AWS',
        difficulty: 'Advanced',
        duration: '8 weeks',
        status: 'Published',
        startDate: 'Available Now'
      }
    ]
    
    // Combine published skills with defaults (published skills first)
    return [...publishedSkills, ...defaultSkills]
  })

  // Update recommended skills when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const publishedSkills = JSON.parse(localStorage.getItem('published_skills') || '[]')
      const defaultSkills = [
        {
          id: 'rec-1',
          title: 'Machine Learning Basics',
          category: 'AI/ML',
          description: 'Learn the fundamentals of machine learning and build your first ML models',
          difficulty: 'Intermediate',
          duration: '6 weeks',
          status: 'Published',
          startDate: 'Available Now'
        },
        {
          id: 'rec-2',
          title: 'Cloud Computing with AWS',
          category: 'Technology',
          description: 'Master cloud infrastructure and deploy scalable applications on AWS',
          difficulty: 'Advanced',
          duration: '8 weeks',
          status: 'Published',
          startDate: 'Available Now'
        }
      ]
      setRecommendedSkills([...publishedSkills, ...defaultSkills])
    }

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange)
    // Also check periodically (for same-tab updates)
    const interval = setInterval(handleStorageChange, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Page Header */}
          <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Skills & Learning</h1>
          <p className="text-slate-600 text-lg">Level up your skills with gamified learning paths</p>
        </div>

        {/* Section 1: Summary Cards */}
        <SkillSummaryCards stats={stats} onCardClick={handleStatCardClick} />

        {/* Section 2: My Skills */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">My Skills</h2>
          <SkillCards
            skills={skills}
            onContinue={handleContinue}
            expandedSkillId={null}
          />
        </div>

        {/* Section 3: My Certifications/Submitted Skills */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">My Certifications</h2>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill/Certificate
            </Button>
          </div>
          
          {loadingSkills ? (
            <Card>
              <div className="text-center py-12 text-slate-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50 animate-pulse" />
                <p>Loading certifications...</p>
              </div>
            </Card>
          ) : submittedSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submittedSkills.map((skill) => (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="h-full flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-slate-900">{skill.title}</h3>
                        {getStatusBadge(skill.status)}
                      </div>
                      {skill.provider && (
                        <p className="text-sm text-slate-600 mb-2">
                          <span className="font-medium">Provider:</span> {skill.provider}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mb-3">
                        Submitted: {new Date(skill.createdAt).toLocaleDateString()}
                      </p>
                      {skill.status === 'rejected' && skill.remarks && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 mb-3">
                          <p className="text-xs font-medium text-red-700 mb-1">Remarks:</p>
                          <p className="text-xs text-red-600">{skill.remarks}</p>
                        </div>
                      )}
                      {skill.status === 'approved' && skill.approvedBy && (
                        <p className="text-xs text-slate-500">
                          Approved by: {skill.approvedBy?.name || 'Faculty'}
                        </p>
                      )}
                    </div>
                    {skill.certificateUrl && (
                      <div className="pt-3 border-t border-slate-200 mt-3">
                        <a
                          href={skill.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Certificate
                        </a>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No certifications submitted</h3>
                <p className="text-slate-500 mb-6">Submit your completed skills and certificates for faculty verification</p>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Skill
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Section 4: Recommended Skills */}
        <div>
          <RecommendedSkills
            recommendedSkills={recommendedSkills}
            onEnroll={handleEnroll}
          />
        </div>

        {/* Add Skill Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setNewSkill({ title: '', provider: '', certificateUrl: '' })
          }}
          title="Add Skill/Certificate"
          size="md"
        >
          <form onSubmit={handleSubmitSkill} className="space-y-4">
            <FormInput
              label="Skill/Certificate Title"
              placeholder="e.g., Python Programming, AWS Cloud Practitioner"
              value={newSkill.title}
              onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
              required
            />
            <FormInput
              label="Provider (Optional)"
              placeholder="e.g., Coursera, Udemy, Google"
              value={newSkill.provider}
              onChange={(e) => setNewSkill({ ...newSkill, provider: e.target.value })}
            />
            <FormInput
              label="Certificate URL (Optional)"
              placeholder="Link to certificate or proof"
              value={newSkill.certificateUrl}
              onChange={(e) => setNewSkill({ ...newSkill, certificateUrl: e.target.value })}
            />
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowAddModal(false)
                  setNewSkill({ title: '', provider: '', certificateUrl: '' })
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit for Verification
              </Button>
            </div>
          </form>
        </Modal>
      </motion.div>
    </MainLayout>
  )
}

export default SkillsPage
