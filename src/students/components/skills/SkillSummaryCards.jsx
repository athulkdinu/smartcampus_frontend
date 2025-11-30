import { motion } from 'framer-motion'
import Card from '../../../shared/components/Card'
import { CheckCircle2, TrendingUp, Award, Clock } from 'lucide-react'

const SkillSummaryCards = ({ stats, onCardClick }) => {
  const cardConfig = [
    {
      label: 'Skills Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      label: 'Skills In Progress',
      value: stats.inProgress,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      label: 'Certificates Earned',
      value: stats.certificates,
      icon: Award,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      label: 'Learning Hours / XP',
      value: stats.learningHours,
      icon: Clock,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardConfig.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onCardClick && onCardClick(stat.label)}
            className="cursor-pointer"
          >
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export default SkillSummaryCards

