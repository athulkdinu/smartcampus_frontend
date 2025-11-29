import { motion } from 'framer-motion'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { BookOpen, Award, TrendingUp, CheckCircle2, UploadCloud } from 'lucide-react'
import { skillPrograms } from '../data/academicData'

const SkillsPage = () => {
  const skills = [
    { name: 'JavaScript Fundamentals', progress: 85, status: 'In Progress', category: 'Programming' },
    { name: 'React Development', progress: 70, status: 'In Progress', category: 'Programming' },
    { name: 'Node.js Backend', progress: 60, status: 'In Progress', category: 'Programming' },
    { name: 'UI/UX Design', progress: 90, status: 'Completed', category: 'Design' },
    { name: 'Data Structures', progress: 100, status: 'Completed', category: 'Computer Science' },
    { name: 'Machine Learning Basics', progress: 45, status: 'In Progress', category: 'AI/ML' }
  ]

  const recommendedSkills = [
    { name: 'Python Programming', category: 'Programming', students: 1200 },
    { name: 'Cloud Computing', category: 'Technology', students: 850 },
    { name: 'DevOps Fundamentals', category: 'Technology', students: 650 }
  ]

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Skills & Learning</h1>
            <p className="text-slate-600">Track your skill development and explore new learning opportunities</p>
          </div>
          <Button variant="primary">Browse All Courses</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Skills Completed', value: 12, icon: CheckCircle2, color: 'from-green-500 to-green-600' },
            { label: 'In Progress', value: 8, icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
            { label: 'Certificates', value: 5, icon: Award, color: 'from-purple-500 to-purple-600' },
            { label: 'Learning Hours', value: '142h', icon: BookOpen, color: 'from-indigo-500 to-indigo-600' }
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
                      <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* My Skills */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">My Skills</h2>
          <div className="space-y-4">
            {skills.map((skill, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{skill.name}</h3>
                    <p className="text-sm text-slate-500">{skill.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    skill.status === 'Completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {skill.status}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-semibold text-slate-900">{skill.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recommended Skills */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedSkills.map((skill, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition cursor-pointer"
              >
                <h3 className="font-semibold text-slate-900 mb-1">{skill.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{skill.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{skill.students} students enrolled</span>
                  <Button variant="ghost" size="sm">Enroll</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Faculty Published Skill Programs */}
        <Card>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Faculty curated</p>
              <h2 className="text-2xl font-bold text-slate-900">Skill Program Library</h2>
              <p className="text-slate-600 text-sm">Everything faculty publish inside SmartCampus shows up here instantly.</p>
            </div>
            
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillPrograms.map((program) => (
              <motion.div
                key={program.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-slate-100 bg-white/80 p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{program.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    program.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700'
                      : program.status === 'upcoming'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    {program.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3">{program.description}</p>
                <div className="text-xs text-slate-500 space-y-1">
                  <p><strong className="text-slate-700">Duration:</strong> {program.duration}</p>
                  <p><strong className="text-slate-700">Mode:</strong> {program.format}</p>
                  <p><strong className="text-slate-700">Faculty:</strong> {program.createdBy}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  {program.materials.map((material) => (
                    <span key={material} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {material}
                    </span>
                  ))}
                </div>
                <Button variant="ghost" size="sm">
                  View Program
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default SkillsPage

