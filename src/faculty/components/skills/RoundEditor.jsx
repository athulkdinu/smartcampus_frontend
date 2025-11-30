import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import FormInput from '../../../shared/components/FormInput'
import { ChevronDown, ChevronUp, Video, FileText, CheckCircle2, X, Plus } from 'lucide-react'

const RoundEditor = ({ 
  round, 
  isExpanded, 
  onToggle, 
  onSave
}) => {
  const [roundData, setRoundData] = useState({
    title: round.title || '',
    videoUrl: round.videoUrl || '',
    notes: round.notes || '',
    questions: round.questions || [],
    requiredScore: round.requiredScore || 80,
    description: round.description || '',
    requirements: round.requirements || []
  })

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A'
  })

  const handleAddQuestion = () => {
    if (!newQuestion.question || !newQuestion.optionA || !newQuestion.optionB || 
        !newQuestion.optionC || !newQuestion.optionD) {
      alert('Please fill in all question fields')
      return
    }

    const question = {
      id: Date.now().toString(),
      question: newQuestion.question,
      options: {
        A: newQuestion.optionA,
        B: newQuestion.optionB,
        C: newQuestion.optionC,
        D: newQuestion.optionD
      },
      correctAnswer: newQuestion.correctAnswer
    }

    setRoundData({
      ...roundData,
      questions: [...roundData.questions, question]
    })

    setNewQuestion({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A'
    })
  }

  const handleRemoveQuestion = (questionId) => {
    setRoundData({
      ...roundData,
      questions: roundData.questions.filter(q => q.id !== questionId)
    })
  }

  const handleSave = () => {
    // Validate based on round type
    if (round.type === 'Learning') {
      if (!roundData.videoUrl && !roundData.notes) {
        alert('Please add at least a video URL or notes')
        return
      }
    }

    if ((round.type === 'Practice' || round.type === 'Assessment') && roundData.questions.length === 0) {
      alert('Please add at least one question')
      return
    }

    if (round.type === 'Project' && !roundData.description) {
      alert('Please add project description')
      return
    }

    onSave({
      ...roundData,
      completed: true
    })
  }

  const getStatusColor = () => {
    if (round.completed) return 'bg-green-50 border-green-200'
    return 'bg-blue-50 border-blue-200'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`${getStatusColor()} transition-all`}>
        {/* Round Header */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center gap-4 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              round.completed
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
            }`}>
              {round.completed ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                round.roundNumber
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-slate-900">{roundData.title}</h3>
                {round.completed && (
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                    Content Added
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600">{round.type} Round</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-slate-200"
            >
              <div className="p-6 space-y-6">
                {/* Round Title Editor */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Round Title
                  </label>
                  <input
                    type="text"
                    value={roundData.title}
                    onChange={(e) => setRoundData({ ...roundData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Basics & Fundamentals"
                  />
                </div>

                {/* Round 1: Video + Notes */}
                {round.type === 'Learning' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Video className="w-4 h-4 text-blue-600" />
                        Video URL
                      </label>
                      <input
                        type="url"
                        value={roundData.videoUrl}
                        onChange={(e) => setRoundData({ ...roundData, videoUrl: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        Study Notes
                      </label>
                      <textarea
                        value={roundData.notes}
                        onChange={(e) => setRoundData({ ...roundData, notes: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Add study notes for students..."
                      />
                    </div>
                  </>
                )}

                {/* Round 3: Project Description */}
                {round.type === 'Project' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Project Description
                    </label>
                    <textarea
                      value={roundData.description}
                      onChange={(e) => setRoundData({ ...roundData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Describe the project requirements..."
                    />
                  </div>
                )}

                {/* Questions Section (for Practice, Assessment, and Learning rounds) */}
                {(round.type === 'Practice' || round.type === 'Assessment' || round.type === 'Learning') && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">
                      Quiz Questions {round.type === 'Learning' && '(Optional)'}
                    </h4>

                    {/* Add Question Form */}
                    <div className="bg-slate-50 p-4 rounded-lg mb-4 space-y-3">
                      <FormInput
                        label="Question"
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        placeholder="Enter your question here..."
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <FormInput
                          label="Option A"
                          value={newQuestion.optionA}
                          onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                          placeholder="Option A"
                        />
                        <FormInput
                          label="Option B"
                          value={newQuestion.optionB}
                          onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                          placeholder="Option B"
                        />
                        <FormInput
                          label="Option C"
                          value={newQuestion.optionC}
                          onChange={(e) => setNewQuestion({ ...newQuestion, optionC: e.target.value })}
                          placeholder="Option C"
                        />
                        <FormInput
                          label="Option D"
                          value={newQuestion.optionD}
                          onChange={(e) => setNewQuestion({ ...newQuestion, optionD: e.target.value })}
                          placeholder="Option D"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-semibold text-slate-700">Correct Answer:</label>
                        <select
                          value={newQuestion.correctAnswer}
                          onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value="A">Option A</option>
                          <option value="B">Option B</option>
                          <option value="C">Option C</option>
                          <option value="D">Option D</option>
                        </select>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleAddQuestion}
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Question
                        </Button>
                      </div>
                    </div>

                    {/* Questions Preview */}
                    {roundData.questions.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-slate-700">
                          Added Questions ({roundData.questions.length})
                        </p>
                        {roundData.questions.map((q, idx) => (
                          <div key={q.id} className="bg-white p-4 rounded-lg border border-slate-200">
                            <div className="flex items-start justify-between mb-2">
                              <p className="font-medium text-slate-900">
                                {idx + 1}. {q.question}
                              </p>
                              <button
                                onClick={() => handleRemoveQuestion(q.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(q.options).map(([key, value]) => (
                                <div
                                  key={key}
                                  className={`p-2 rounded ${
                                    key === q.correctAnswer
                                      ? 'bg-green-50 border border-green-200 text-green-700'
                                      : 'bg-slate-50 text-slate-600'
                                  }`}
                                >
                                  <span className="font-semibold">{key}:</span> {value}
                                  {key === q.correctAnswer && (
                                    <span className="ml-2 text-xs">✓ Correct</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Required Score (for rounds with questions) */}
                {(round.type === 'Practice' || round.type === 'Assessment' || round.type === 'Learning') && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Required Score to Pass (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={roundData.requiredScore}
                      onChange={(e) => setRoundData({ ...roundData, requiredScore: parseInt(e.target.value) || 80 })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <Button variant="primary" onClick={handleSave}>
                    Save Round
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export default RoundEditor

