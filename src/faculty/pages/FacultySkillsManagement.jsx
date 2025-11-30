import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Plus, BookOpen, Edit, Globe, FileText, Users, CheckCircle2, Eye } from 'lucide-react'

const FacultySkillsManagement = () => {
  const navigate = useNavigate()
  const [skills, setSkills] = useState(() => {
    // Load from localStorage or use empty array
    const saved = localStorage.getItem('faculty_skills')
    return saved ? JSON.parse(saved) : []
  })

  // Mock student enrollment data - in real app, this would come from backend
  const [studentEnrollments] = useState(() => {
    const saved = localStorage.getItem('skill_student_enrollments')
    if (saved) return JSON.parse(saved)
    
    // Initialize with mock data
    const mockData = {}
    skills.forEach(skill => {
      mockData[skill.id] = {
        enrolled: Math.floor(Math.random() * 50) + 10,
        completed: Math.floor(Math.random() * 20) + 2
      }
    })
    localStorage.setItem('skill_student_enrollments', JSON.stringify(mockData))
    return mockData
  })

  useEffect(() => {
    // Save to localStorage whenever skills change
    localStorage.setItem('faculty_skills', JSON.stringify(skills))
  }, [skills])

  const handleCreateNew = () => {
    const newSkill = {
      id: Date.now().toString(),
      title: 'New Skill',
      status: 'Draft',
      published: false,
      rounds: [
        {
          roundNumber: 1,
          title: 'Learning Video + Notes + Quiz',
          type: 'Learning',
          completed: false,
          videoUrl: '',
          notes: '',
          questions: [],
          requiredScore: 80
        },
        {
          roundNumber: 2,
          title: 'Practice Exercise',
          type: 'Practice',
          completed: false,
          questions: [],
          requiredScore: 80
        },
        {
          roundNumber: 3,
          title: 'Mini Project',
          type: 'Project',
          completed: false,
          description: '',
          requirements: []
        },
        {
          roundNumber: 4,
          title: 'Final Assessment Quiz',
          type: 'Assessment',
          completed: false,
          questions: [],
          requiredScore: 80
        }
      ],
      createdAt: new Date().toISOString()
    }
    setSkills([...skills, newSkill])
    navigate(`/faculty/skills/${newSkill.id}`)
  }

  const handleManage = (skillId) => {
    navigate(`/faculty/skills/${skillId}`)
  }

  const handleViewProgress = (skillId) => {
    navigate(`/faculty/skills/${skillId}/students`)
  }

  const getStatusBadge = (status, published) => {
    if (published) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
          <Globe className="w-3 h-3" />
          Published
        </span>
      )
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
        <FileText className="w-3 h-3" />
        Draft
      </span>
    )
  }

  const getEnrollmentStats = (skillId) => {
    return studentEnrollments[skillId] || { enrolled: 0, completed: 0 }
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Skills Management</h1>
            <p className="text-slate-600">Create and manage learning skills for students</p>
          </div>
          <Button variant="primary" onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Skill
          </Button>
        </div>

        {/* Skills Grid */}
        {skills.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No skills created yet</h3>
              <p className="text-slate-500 mb-6">Get started by creating your first skill</p>
              <Button variant="primary" onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Skill
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, idx) => {
              const stats = getEnrollmentStats(skill.id)
              
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full flex flex-col">
                    <div className="flex-1">
                      {/* Skill Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-bold text-slate-900">{skill.title}</h3>
                          </div>
                          {getStatusBadge(skill.status, skill.published)}
                        </div>
                      </div>

                      {/* Student Stats */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-slate-700">Students Enrolled</span>
                          </div>
                          <span className="text-lg font-bold text-slate-900">{stats.enrolled}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-slate-700">Students Completed</span>
                          </div>
                          <span className="text-lg font-bold text-slate-900">{stats.completed}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleManage(skill.id)}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      {skill.published && stats.enrolled > 0 && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleViewProgress(skill.id)}
                          className="flex-1 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Progress
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </FacultyLayout>
  )
}

export default FacultySkillsManagement
