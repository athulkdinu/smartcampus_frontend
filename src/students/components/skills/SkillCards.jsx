import { motion } from 'framer-motion'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { CheckCircle2, Lock, Play } from 'lucide-react'

const SkillCards = ({ skills, onContinue, expandedSkillId }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  const getCurrentRound = (skill) => {
    if (skill.status === 'Not Started') return 0
    if (skill.status === 'Completed') return skill.totalRounds
    return skill.currentRound || 1
  }

  const isRoundUnlocked = (skill, roundNumber) => {
    if (skill.status === 'Completed') return true
    if (skill.status === 'Not Started') return roundNumber === 1
    return roundNumber <= skill.currentRound
  }

  return (
    <div className="space-y-4">
      {skills.map((skill, idx) => {
        const currentRound = getCurrentRound(skill)
        const progress = skill.status === 'Completed' 
          ? 100 
          : skill.status === 'Not Started' 
            ? 0 
            : (currentRound / skill.totalRounds) * 100

        return (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{skill.name}</h3>
                    <p className="text-sm text-slate-500">{skill.category}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(skill.status)}`}>
                    {skill.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600 font-medium">Progress</span>
                    <span className="font-bold text-slate-900">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full"
                    />
                  </div>
                </div>

                {/* Round Stepper */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    {Array.from({ length: skill.totalRounds }, (_, i) => i + 1).map((roundNum) => {
                      const isUnlocked = isRoundUnlocked(skill, roundNum)
                      const isActive = roundNum === currentRound && skill.status === 'In Progress'
                      const isCompleted = roundNum < currentRound || skill.status === 'Completed'

                      return (
                        <div key={roundNum} className="flex items-center flex-1">
                          <div className="flex flex-col items-center flex-1">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                isCompleted
                                  ? 'bg-green-500 text-white shadow-lg'
                                  : isActive
                                  ? 'bg-blue-500 text-white shadow-lg ring-4 ring-blue-200'
                                  : isUnlocked
                                  ? 'bg-slate-300 text-slate-600'
                                  : 'bg-slate-200 text-slate-400'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : !isUnlocked ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                roundNum
                              )}
                            </div>
                            <span className={`text-xs mt-2 font-medium ${
                              isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-400'
                            }`}>
                              Round {roundNum}
                            </span>
                          </div>
                          {roundNum < skill.totalRounds && (
                            <div className={`flex-1 h-0.5 mx-2 ${
                              isCompleted || roundNum < currentRound
                                ? 'bg-green-500'
                                : isUnlocked
                                ? 'bg-slate-300'
                                : 'bg-slate-200'
                            }`} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-sm font-medium text-slate-600">
                      {skill.status === 'Completed' 
                        ? `Completed all ${skill.totalRounds} rounds`
                        : skill.status === 'Not Started'
                        ? 'Not started yet'
                        : `Round ${currentRound} of ${skill.totalRounds}`
                      }
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end">
                  <Button
                    variant={skill.status === 'Not Started' ? 'primary' : 'secondary'}
                    onClick={() => onContinue(skill.id)}
                    className="flex items-center gap-2"
                  >
                    {skill.status === 'Not Started' ? (
                      <>
                        <Play className="w-4 h-4" />
                        Start
                      </>
                    ) : skill.status === 'Completed' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        View Details
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Continue
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export default SkillCards

