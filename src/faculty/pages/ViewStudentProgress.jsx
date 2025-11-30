import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { ArrowLeft, Users, CheckCircle2, Clock, Lock, Eye } from 'lucide-react'

const ViewStudentProgress = () => {
  const { skillId } = useParams()
  const navigate = useNavigate()
  
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('faculty_skills')
    return saved ? JSON.parse(saved) : []
  })

  const [skill, setSkill] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)

  // Mock student progress data
  const [studentProgress] = useState(() => {
    const saved = localStorage.getItem(`skill_${skillId}_student_progress`)
    if (saved) return JSON.parse(saved)
    
    // Generate mock data
    const mockStudents = [
      {
        id: 'stu-1',
        name: 'John Doe',
        registerNo: 'STU-2024-001',
        currentRound: 3,
        lastActivity: '2025-01-20',
        rounds: [
          { roundNumber: 1, status: 'Completed', score: 85, completedAt: '2025-01-15' },
          { roundNumber: 2, status: 'Completed', score: 90, completedAt: '2025-01-18' },
          { roundNumber: 3, status: 'In Progress', score: null, startedAt: '2025-01-20' },
          { roundNumber: 4, status: 'Locked', score: null }
        ]
      },
      {
        id: 'stu-2',
        name: 'Jane Smith',
        registerNo: 'STU-2024-002',
        currentRound: 2,
        lastActivity: '2025-01-19',
        rounds: [
          { roundNumber: 1, status: 'Completed', score: 92, completedAt: '2025-01-14' },
          { roundNumber: 2, status: 'In Progress', score: null, startedAt: '2025-01-19' },
          { roundNumber: 3, status: 'Locked', score: null },
          { roundNumber: 4, status: 'Locked', score: null }
        ]
      },
      {
        id: 'stu-3',
        name: 'Mike Johnson',
        registerNo: 'STU-2024-003',
        currentRound: 4,
        lastActivity: '2025-01-21',
        rounds: [
          { roundNumber: 1, status: 'Completed', score: 88, completedAt: '2025-01-13' },
          { roundNumber: 2, status: 'Completed', score: 95, completedAt: '2025-01-16' },
          { roundNumber: 3, status: 'Completed', score: 87, completedAt: '2025-01-19' },
          { roundNumber: 4, status: 'In Progress', score: null, startedAt: '2025-01-21' }
        ]
      },
      {
        id: 'stu-4',
        name: 'Sarah Williams',
        registerNo: 'STU-2024-004',
        currentRound: 1,
        lastActivity: '2025-01-12',
        rounds: [
          { roundNumber: 1, status: 'In Progress', score: null, startedAt: '2025-01-12' },
          { roundNumber: 2, status: 'Locked', score: null },
          { roundNumber: 3, status: 'Locked', score: null },
          { roundNumber: 4, status: 'Locked', score: null }
        ]
      },
      {
        id: 'stu-5',
        name: 'David Brown',
        registerNo: 'STU-2024-005',
        currentRound: 4,
        lastActivity: '2025-01-22',
        rounds: [
          { roundNumber: 1, status: 'Completed', score: 90, completedAt: '2025-01-10' },
          { roundNumber: 2, status: 'Completed', score: 93, completedAt: '2025-01-15' },
          { roundNumber: 3, status: 'Completed', score: 89, completedAt: '2025-01-18' },
          { roundNumber: 4, status: 'Completed', score: 91, completedAt: '2025-01-22' }
        ]
      }
    ]
    
    localStorage.setItem(`skill_${skillId}_student_progress`, JSON.stringify(mockStudents))
    return mockStudents
  })

  useEffect(() => {
    const foundSkill = skills.find(s => s.id === skillId)
    if (foundSkill) {
      setSkill(foundSkill)
    } else {
      navigate('/faculty/skills')
    }
  }, [skillId, skills, navigate])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Locked':
        return 'bg-slate-100 text-slate-500 border-slate-200'
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4" />
      case 'In Progress':
        return <Clock className="w-4 h-4" />
      case 'Locked':
        return <Lock className="w-4 h-4" />
      default:
        return null
    }
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
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/faculty/skills')}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Skills
            </Button>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{skill.title}</h1>
            <p className="text-slate-600">Student Progress & Performance</p>
          </div>
        </div>

        {!selectedStudent ? (
          /* Students List */
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Enrolled Students ({studentProgress.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Student Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Register No</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Current Round</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Progress</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Last Activity</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentProgress.map((student, idx) => {
                      const completedRounds = student.rounds.filter(r => r.status === 'Completed').length
                      const progressText = `${completedRounds}/4 rounds`
                      
                      return (
                        <motion.tr
                          key={student.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >
                          <td className="py-3 px-4 text-sm font-medium text-slate-900">{student.name}</td>
                          <td className="py-3 px-4 text-sm text-slate-600">{student.registerNo}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                              Round {student.currentRound}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">{progressText}</td>
                          <td className="py-3 px-4 text-sm text-slate-500">{student.lastActivity}</td>
                          <td className="py-3 px-4">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setSelectedStudent(student)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </Button>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        ) : (
          /* Student Detail View */
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedStudent.name}</h2>
                    <p className="text-slate-600">{selectedStudent.registerNo}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedStudent(null)}
                  >
                    Back to List
                  </Button>
                </div>

                <div className="space-y-4">
                  {selectedStudent.rounds.map((round, idx) => {
                    const roundData = skill.rounds.find(r => r.roundNumber === round.roundNumber)
                    const statusConfig = getStatusBadge(round.status)
                    const StatusIcon = getStatusIcon(round.status)

                    return (
                      <motion.div
                        key={round.roundNumber}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              round.status === 'Completed'
                                ? 'bg-green-500 text-white'
                                : round.status === 'In Progress'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-300 text-slate-600'
                            }`}>
                              {round.status === 'Completed' ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : round.status === 'Locked' ? (
                                <Lock className="w-5 h-5" />
                              ) : (
                                round.roundNumber
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900">
                                Round {round.roundNumber}: {roundData?.title || 'Round Title'}
                              </h3>
                              <p className="text-sm text-slate-500">{roundData?.type || 'Round Type'}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${statusConfig}`}>
                            {StatusIcon}
                            {round.status}
                          </span>
                        </div>

                        {round.status === 'Completed' && round.score !== null && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">Score:</span>
                              <span className="text-lg font-bold text-green-700">{round.score}%</span>
                            </div>
                            {round.completedAt && (
                              <p className="text-xs text-slate-500 mt-1">Completed on {round.completedAt}</p>
                            )}
                          </div>
                        )}

                        {round.status === 'In Progress' && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-slate-700">
                              Started on {round.startedAt || 'Recently'}
                            </p>
                          </div>
                        )}

                        {round.status === 'Locked' && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                            <p className="text-sm text-slate-500 italic">
                              This round will unlock after completing Round {round.roundNumber - 1}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </FacultyLayout>
  )
}

export default ViewStudentProgress

