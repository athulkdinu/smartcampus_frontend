import { motion } from 'framer-motion'
import { Award, TrendingUp } from 'lucide-react'

const SkillProgressHeader = ({ skillName, progressPercent, currentRound, totalRounds }) => {
  return (
    <div className="mb-8">
      {/* Skill Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{skillName}</h1>
          <p className="text-slate-600">
            {currentRound <= totalRounds 
              ? `Round ${currentRound} of ${totalRounds}`
              : 'All rounds completed!'
            }
          </p>
        </div>
        {progressPercent === 100 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white">
            <Award className="w-5 h-5" />
            <span className="font-semibold">Completed</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Overall Progress</span>
          <span className="font-bold text-slate-900">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-4 rounded-full relative"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <TrendingUp className="w-4 h-4" />
          <span>{Math.round(progressPercent)}% complete • {currentRound - 1} of {totalRounds} rounds finished</span>
        </div>
      </div>
    </div>
  )
}

export default SkillProgressHeader

