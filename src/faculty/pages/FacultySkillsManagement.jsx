import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Plus, BookOpen, Edit, Globe, FileText } from 'lucide-react'

const FacultySkillsManagement = () => {
  const navigate = useNavigate()
  const [skills, setSkills] = useState(() => {
    // Load from localStorage or use empty array
    const saved = localStorage.getItem('faculty_skills')
    return saved ? JSON.parse(saved) : []
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

  const getCompletionStatus = (skill) => {
    const completedRounds = skill.rounds.filter(r => r.completed).length
    return `${completedRounds}/4 rounds completed`
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

        {/* Skills List */}
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
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Skill Title</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Progress</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((skill, idx) => (
                    <motion.tr
                      key={skill.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-slate-900">{skill.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(skill.status, skill.published)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">{getCompletionStatus(skill)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleManage(skill.id)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Manage
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </motion.div>
    </FacultyLayout>
  )
}

export default FacultySkillsManagement

