import { motion } from 'framer-motion'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { Clock, TrendingUp, Calendar } from 'lucide-react'

const RecommendedSkills = ({ recommendedSkills, onEnroll }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Recommended For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedSkills.map((skill, idx) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{skill.title}</h3>
                    <p className="text-sm text-slate-500">{skill.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(skill.status)}`}>
                    {skill.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{skill.description}</p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">Difficulty:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getDifficultyColor(skill.difficulty)}`}>
                      {skill.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">Duration:</span>
                    <span>{skill.duration}</span>
                  </div>
                  {skill.startDate && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">Starts:</span>
                      <span>{skill.startDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-200">
                <Button
                  variant={skill.status === 'Published' ? 'primary' : 'secondary'}
                  onClick={() => onEnroll && onEnroll(skill.id)}
                  className="w-full"
                  disabled={skill.status === 'Upcoming'}
                >
                  {skill.status === 'Published' ? 'Enroll Now' : 'View Program'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default RecommendedSkills

