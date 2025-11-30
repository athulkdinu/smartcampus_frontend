import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Lock, Play, FileText, Code, ClipboardCheck, Video } from 'lucide-react'
import Button from '../../../shared/components/Button'
import Card from '../../../shared/components/Card'

const RoundCard = ({ 
  roundNumber, 
  title, 
  type, 
  status, 
  isExpanded, 
  onToggle, 
  onMarkComplete,
  content 
}) => {
  const getRoundIcon = (type) => {
    switch (type) {
      case 'Learning':
        return Video
      case 'Practice':
        return Code
      case 'Project':
        return ClipboardCheck
      case 'Assessment':
        return FileText
      default:
        return Play
    }
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: CheckCircle2,
          iconColor: 'text-green-600',
          badge: 'bg-green-100 text-green-700 border-green-200',
          text: 'text-green-700'
        }
      case 'active':
        return {
          bg: 'bg-blue-50 border-blue-300 border-2',
          icon: Play,
          iconColor: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-700 border-blue-200',
          text: 'text-blue-700'
        }
      case 'locked':
        return {
          bg: 'bg-slate-50 border-slate-200',
          icon: Lock,
          iconColor: 'text-slate-400',
          badge: 'bg-slate-100 text-slate-500 border-slate-200',
          text: 'text-slate-500'
        }
      default:
        return {
          bg: 'bg-slate-50 border-slate-200',
          icon: Lock,
          iconColor: 'text-slate-400',
          badge: 'bg-slate-100 text-slate-500 border-slate-200',
          text: 'text-slate-500'
        }
    }
  }

  const statusConfig = getStatusConfig(status)
  const Icon = getRoundIcon(type)
  const StatusIcon = statusConfig.icon

  const canExpand = status === 'active' || status === 'completed'
  const isClickable = status !== 'locked'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: roundNumber * 0.1 }}
    >
      <Card 
        className={`transition-all duration-300 ${
          status === 'active' ? 'shadow-lg ring-2 ring-blue-200' : ''
        } ${statusConfig.bg}`}
      >
        <div
          className={`cursor-pointer ${!isClickable ? 'cursor-not-allowed opacity-60' : ''}`}
          onClick={() => canExpand && onToggle()}
        >
          {/* Round Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Round Number Badge */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                status === 'completed'
                  ? 'bg-green-500 text-white'
                  : status === 'active'
                  ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                  : 'bg-slate-300 text-slate-600'
              }`}>
                {status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : status === 'locked' ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  roundNumber
                )}
              </div>

              {/* Round Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Icon className={`w-5 h-5 ${statusConfig.iconColor}`} />
                  <h3 className={`text-lg font-bold ${statusConfig.text}`}>{title}</h3>
                </div>
                <p className="text-sm text-slate-600">{type} Round</p>
              </div>

              {/* Status Badge */}
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border capitalize ${statusConfig.badge}`}>
                {status === 'completed' ? 'Completed' : status === 'active' ? 'In Progress' : 'Locked'}
              </span>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && canExpand && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 border-t border-slate-200 pt-4 space-y-4">
                {/* Video Section */}
                {content?.video && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Video className="w-4 h-4 text-blue-600" />
                      Learning Video
                    </h4>
                    <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Play className="w-16 h-16 text-white/50 mx-auto mb-2" />
                          <p className="text-white/70 text-sm">Video Player Placeholder</p>
                          <p className="text-white/50 text-xs mt-1">{content.video}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                {content?.notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      Study Notes
                    </h4>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <p className="text-sm text-slate-700 whitespace-pre-line">{content.notes}</p>
                    </div>
                  </div>
                )}

                {/* Practice/Project Section */}
                {content?.exercise && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4 text-green-600" />
                      {type === 'Project' ? 'Project Requirements' : 'Practice Exercise'}
                    </h4>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <p className="text-sm text-slate-700 mb-3">{content.exercise}</p>
                      {content.requirements && (
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                          {content.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {/* Assessment Section */}
                {content?.assessment && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-red-600" />
                      Final Assessment
                    </h4>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <p className="text-sm text-slate-700 mb-3">{content.assessment}</p>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-amber-800">
                          <strong>Note:</strong> This assessment will test your understanding of all previous rounds.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {status === 'active' && (
                    <>
                      {roundNumber === 1 && (
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            onMarkComplete()
                          }}
                          className="flex items-center gap-2"
                        >
                          <ClipboardCheck className="w-4 h-4" />
                          Take Quiz & Complete
                        </Button>
                      )}
                      {roundNumber === 2 && (
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            onMarkComplete()
                          }}
                          className="flex items-center gap-2"
                        >
                          <Code className="w-4 h-4" />
                          Mark Exercise Complete
                        </Button>
                      )}
                      {roundNumber === 3 && (
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            onMarkComplete()
                          }}
                          className="flex items-center gap-2"
                        >
                          <ClipboardCheck className="w-4 h-4" />
                          Submit Project
                        </Button>
                      )}
                      {roundNumber === 4 && (
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            onMarkComplete()
                          }}
                          className="flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Complete Assessment
                        </Button>
                      )}
                    </>
                  )}
                  {status === 'completed' && (
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-medium">Round completed successfully!</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export default RoundCard

