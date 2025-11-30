import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { CheckCircle2, Circle, Check } from 'lucide-react'

const SkillDetail = ({ skill, onMarkComplete, onClose }) => {
  if (!skill) return null

  const currentRound = skill.status === 'Completed' 
    ? skill.totalRounds 
    : skill.status === 'Not Started' 
      ? 1 
      : skill.currentRound || 1

  const roundData = skill.rounds?.find(r => r.roundNumber === currentRound)

  if (!roundData) return null

  const allTasksCompleted = roundData.tasks.every(task => task.completed)
  const completedTasksCount = roundData.tasks.filter(task => task.completed).length

  const handleTaskToggle = (taskId) => {
    // This would update the task completion status
    // For now, just visual update in parent component
  }

  const handleMarkComplete = () => {
    if (allTasksCompleted && onMarkComplete) {
      onMarkComplete(skill.id, currentRound)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <Card className="mt-4 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">
                  {roundData.title}
                </h4>
                <p className="text-sm text-slate-600">
                  Round {currentRound} of {skill.totalRounds}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600 font-medium">Round Progress</span>
                <span className="font-bold text-slate-900">
                  {completedTasksCount} / {roundData.tasks.length} tasks completed
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedTasksCount / roundData.tasks.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Task List */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-slate-900 mb-3">Tasks</h5>
              <div className="space-y-2">
                {roundData.tasks.map((task, idx) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      task.completed
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-white border border-slate-200'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      task.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      {task.completed ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Circle className="w-3 h-3" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        task.completed ? 'text-green-700 line-through' : 'text-slate-900'
                      }`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mark Complete Button */}
            {allTasksCompleted && currentRound <= skill.totalRounds && (
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleMarkComplete}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {currentRound === skill.totalRounds ? 'Complete Skill' : 'Complete Round & Unlock Next'}
                </Button>
              </div>
            )}

            {!allTasksCompleted && (
              <div className="text-center py-4">
                <p className="text-sm text-slate-500">
                  Complete all tasks to unlock the next round
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

export default SkillDetail

