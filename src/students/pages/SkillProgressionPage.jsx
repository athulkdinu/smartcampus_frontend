import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import MainLayout from '../../shared/layouts/MainLayout'
import Button from '../../shared/components/Button'
import SkillProgressHeader from '../components/skills/SkillProgressHeader'
import RoundCard from '../components/skills/RoundCard'
import CompletionModal from '../components/skills/CompletionModal'

const SkillProgressionPage = () => {
  const { skillId } = useParams()
  const navigate = useNavigate()
  
  // Mock skill data - in real app, fetch from API
  const mockSkills = {
    '1': {
      id: '1',
      name: 'Python Programming',
      category: 'Programming',
      rounds: [
        {
          roundNumber: 1,
          title: 'Basics & Fundamentals',
          type: 'Learning',
          content: {
            video: 'Introduction to Python - Complete Guide',
            notes: 'In this round, you will learn:\n\n• Python syntax and basic concepts\n• Variables, data types, and operators\n• Control flow (if/else, loops)\n• Functions and modules\n\nTake your time to understand each concept before moving to the quiz.'
          }
        },
        {
          roundNumber: 2,
          title: 'Practice Exercises',
          type: 'Practice',
          content: {
            exercise: 'Complete the following coding exercises to reinforce your learning:',
            requirements: [
              'Write a function to calculate factorial',
              'Create a program to find prime numbers',
              'Build a simple calculator',
              'Implement a text-based game'
            ]
          }
        },
        {
          roundNumber: 3,
          title: 'Mini Project',
          type: 'Project',
          content: {
            exercise: 'Build a complete Python application:',
            requirements: [
              'Create a file management system',
              'Implement user authentication',
              'Add data persistence',
              'Include error handling',
              'Write unit tests'
            ]
          }
        },
        {
          roundNumber: 4,
          title: 'Final Assessment',
          type: 'Assessment',
          content: {
            assessment: 'This final assessment will test your understanding of:\n\n• Core Python concepts\n• Problem-solving skills\n• Code quality and best practices\n• Project implementation\n\nYou have 60 minutes to complete the assessment. Good luck!'
          }
        }
      ]
    },
    '2': {
      id: '2',
      name: 'React Development',
      category: 'Web Development',
      rounds: [
        {
          roundNumber: 1,
          title: 'React Fundamentals',
          type: 'Learning',
          content: {
            video: 'React Basics - Components, Props, and State',
            notes: 'In this round, you will learn:\n\n• What is React and why use it\n• JSX syntax and components\n• Props and prop drilling\n• State management with useState\n• Component lifecycle\n\nMake sure to practice along with the video!'
          }
        },
        {
          roundNumber: 2,
          title: 'Practice Exercises',
          type: 'Practice',
          content: {
            exercise: 'Complete these React exercises:',
            requirements: [
              'Build a todo list component',
              'Create a counter with increment/decrement',
              'Build a form with validation',
              'Implement a search filter component'
            ]
          }
        },
        {
          roundNumber: 3,
          title: 'Mini Project',
          type: 'Project',
          content: {
            exercise: 'Build a React application:',
            requirements: [
              'Create a weather dashboard',
              'Implement routing with React Router',
              'Add state management',
              'Fetch data from an API',
              'Make it responsive'
            ]
          }
        },
        {
          roundNumber: 4,
          title: 'Final Assessment',
          type: 'Assessment',
          content: {
            assessment: 'Final React assessment covering:\n\n• Component architecture\n• State management patterns\n• Performance optimization\n• Best practices and code quality\n\nTime limit: 90 minutes'
          }
        }
      ]
    },
    '3': {
      id: '3',
      name: 'UI/UX Design',
      category: 'Design',
      rounds: [
        {
          roundNumber: 1,
          title: 'Design Principles',
          type: 'Learning',
          content: {
            video: 'UI/UX Design Fundamentals',
            notes: 'In this round, you will learn:\n\n• Design thinking process\n• Color theory and typography\n• Layout and composition\n• User-centered design principles\n• Accessibility guidelines'
          }
        },
        {
          roundNumber: 2,
          title: 'Practice Exercises',
          type: 'Practice',
          content: {
            exercise: 'Complete these design exercises:',
            requirements: [
              'Create 5 different color palettes',
              'Design a mobile app wireframe',
              'Build a style guide',
              'Create user personas'
            ]
          }
        },
        {
          roundNumber: 3,
          title: 'Portfolio Project',
          type: 'Project',
          content: {
            exercise: 'Build a complete design portfolio:',
            requirements: [
              'Design 3 app interfaces',
              'Create high-fidelity mockups',
              'Build interactive prototypes',
              'Document design process'
            ]
          }
        },
        {
          roundNumber: 4,
          title: 'Final Assessment',
          type: 'Assessment',
          content: {
            assessment: 'Final design assessment covering:\n\n• Design principles application\n• User research methods\n• Prototyping skills\n• Portfolio presentation\n\nTime limit: 120 minutes'
          }
        }
      ]
    },
    '4': {
      id: '4',
      name: 'Data Structures & Algorithms',
      category: 'Computer Science',
      rounds: [
        {
          roundNumber: 1,
          title: 'Introduction to DSA',
          type: 'Learning',
          content: {
            video: 'Data Structures and Algorithms Basics',
            notes: 'In this round, you will learn:\n\n• Arrays, linked lists, stacks, queues\n• Time and space complexity\n• Big O notation\n• Algorithm analysis\n• Problem-solving strategies'
          }
        },
        {
          roundNumber: 2,
          title: 'Practice Exercises',
          type: 'Practice',
          content: {
            exercise: 'Solve these coding problems:',
            requirements: [
              'Implement 5 basic data structures',
              'Solve 10 LeetCode easy problems',
              'Analyze time complexity',
              'Optimize algorithms'
            ]
          }
        },
        {
          roundNumber: 3,
          title: 'Algorithm Project',
          type: 'Project',
          content: {
            exercise: 'Build an algorithm library:',
            requirements: [
              'Implement sorting algorithms',
              'Create graph algorithms',
              'Build tree traversal methods',
              'Document algorithm complexity'
            ]
          }
        },
        {
          roundNumber: 4,
          title: 'Final Assessment',
          type: 'Assessment',
          content: {
            assessment: 'Final DSA assessment covering:\n\n• Data structure implementation\n• Algorithm design\n• Complexity analysis\n• Problem-solving under time pressure\n\nTime limit: 90 minutes'
          }
        }
      ]
    }
  }

  const skill = mockSkills[skillId]
  
  // If skill not found, redirect back
  if (!skill) {
    navigate('/student/skills')
    return null
  }
  
  const totalRounds = 4

  const [currentRound, setCurrentRound] = useState(1)
  const [completedRounds, setCompletedRounds] = useState([])
  const [expandedRound, setExpandedRound] = useState(1)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  const progressPercent = (completedRounds.length / totalRounds) * 100

  // Initialize from localStorage or default
  useEffect(() => {
    const saved = localStorage.getItem(`skill_${skillId}_progress`)
    if (saved) {
      const data = JSON.parse(saved)
      setCurrentRound(data.currentRound || 1)
      setCompletedRounds(data.completedRounds || [])
      setExpandedRound(data.currentRound || 1)
    }
  }, [skillId])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(`skill_${skillId}_progress`, JSON.stringify({
      currentRound,
      completedRounds
    }))
  }, [currentRound, completedRounds, skillId])

  const getRoundStatus = (roundNumber) => {
    if (completedRounds.includes(roundNumber)) {
      return 'completed'
    }
    if (roundNumber === currentRound) {
      return 'active'
    }
    if (roundNumber < currentRound) {
      return 'completed'
    }
    return 'locked'
  }

  const handleToggleRound = (roundNumber) => {
    const status = getRoundStatus(roundNumber)
    if (status === 'active' || status === 'completed') {
      setExpandedRound(expandedRound === roundNumber ? null : roundNumber)
    }
  }

  const handleMarkComplete = () => {
    if (!completedRounds.includes(currentRound)) {
      const newCompleted = [...completedRounds, currentRound]
      setCompletedRounds(newCompleted)

      // If this was the last round, show completion modal
      if (currentRound === totalRounds) {
        setShowCompletionModal(true)
        setCurrentRound(totalRounds + 1) // Mark as fully completed
      } else {
        // Unlock next round
        setCurrentRound(currentRound + 1)
        setExpandedRound(currentRound + 1)
      }
    }
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/student/skills')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Skills
        </Button>

        {/* Progress Header */}
        <SkillProgressHeader
          skillName={skill.name}
          progressPercent={progressPercent}
          currentRound={currentRound}
          totalRounds={totalRounds}
        />

        {/* Rounds List */}
        <div className="space-y-4">
          {skill.rounds.map((round) => {
            const status = getRoundStatus(round.roundNumber)
            const isExpanded = expandedRound === round.roundNumber

            return (
              <RoundCard
                key={round.roundNumber}
                roundNumber={round.roundNumber}
                title={round.title}
                type={round.type}
                status={status}
                isExpanded={isExpanded}
                onToggle={() => handleToggleRound(round.roundNumber)}
                onMarkComplete={handleMarkComplete}
                content={round.content}
              />
            )
          })}
        </div>

        {/* Completion Modal */}
        <CompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          skillName={skill.name}
        />
      </motion.div>
    </MainLayout>
  )
}

export default SkillProgressionPage

