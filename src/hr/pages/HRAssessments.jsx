import { useState } from 'react'
import toast from 'react-hot-toast'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { assessments as assessmentSeed, assessmentQuestionBank } from '../data/hrDemoData'
import { CheckCircle2, PlusCircle } from 'lucide-react'

const HRAssessments = () => {
  const [tests, setTests] = useState(assessmentSeed)
  const [testForm, setTestForm] = useState({
    title: '',
    jobId: '',
    duration: 30,
    questions: 10
  })
  const [questionForm, setQuestionForm] = useState({
    testId: 'TEST-101',
    question: '',
    options: ['', '', '', ''],
    answer: ''
  })

  const handleCreateTest = (e) => {
    e.preventDefault()
    if (!testForm.title || !testForm.jobId) {
      toast.error('Add title and job ID')
      return
    }
    const newTest = {
      id: `TEST-${Math.floor(Math.random() * 900 + 100)}`,
      assigned: 0,
      status: 'Draft',
      ...testForm
    }
    setTests(prev => [newTest, ...prev])
    toast.success('Assessment created as draft')
    setTestForm({ title: '', jobId: '', duration: 30, questions: 10 })
  }

  const handleAddQuestion = (e) => {
    e.preventDefault()
    if (!questionForm.question || !questionForm.answer) {
      toast.error('Add question and answer')
      return
    }
    assessmentQuestionBank.push({
      testId: questionForm.testId,
      question: questionForm.question,
      options: questionForm.options,
      answer: questionForm.answer
    })
    toast.success('Question saved to bank')
    setQuestionForm({ testId: questionForm.testId, question: '', options: ['', '', '', ''], answer: '' })
  }

  const updateOption = (index, value) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) => (idx === index ? value : opt))
    }))
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Assessments</p>
            <h1 className="text-3xl font-bold text-slate-900">Publish MCQ & coding tests</h1>
            <p className="text-slate-600">Design screening rounds so students can attempt remotely.</p>
          </div>
          <Button variant="primary">
            <PlusCircle className="w-4 h-4 mr-2" />
            Share instructions
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Active assessments</h2>
            <div className="space-y-4">
              {tests.map(test => (
                <div key={test.id} className="p-5 rounded-2xl border border-slate-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{test.id}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{test.title}</h3>
                      <p className="text-sm text-slate-500">{test.jobId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      test.status === 'Live'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {test.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
                    <span>{test.questions} questions</span>
                    <span>{test.duration} mins</span>
                    <span>{test.assigned} assigned</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Create assessment</h2>
              <form onSubmit={handleCreateTest} className="space-y-4">
                <FormInput
                  label="Title"
                  value={testForm.title}
                  onChange={(e) => setTestForm(prev => ({ ...prev, title: e.target.value }))}
                />
                <FormInput
                  label="Job ID"
                  value={testForm.jobId}
                  onChange={(e) => setTestForm(prev => ({ ...prev, jobId: e.target.value }))}
                  placeholder="JOB-210"
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    label="Duration (mins)"
                    type="number"
                    value={testForm.duration}
                    onChange={(e) => setTestForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  />
                  <FormInput
                    label="Questions"
                    type="number"
                    value={testForm.questions}
                    onChange={(e) => setTestForm(prev => ({ ...prev, questions: Number(e.target.value) }))}
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Save assessment
                </Button>
              </form>
            </Card>

            <Card>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Question bank</h2>
              <form onSubmit={handleAddQuestion} className="space-y-3">
                <FormInput
                  label="Assessment ID"
                  value={questionForm.testId}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, testId: e.target.value }))}
                />
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Question</label>
                  <textarea
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                    rows={2}
                    value={questionForm.question}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                  />
                </div>
                {questionForm.options.map((option, idx) => (
                  <FormInput
                    key={idx}
                    label={`Option ${idx + 1}`}
                    value={option}
                    onChange={(e) => updateOption(idx, e.target.value)}
                  />
                ))}
                <FormInput
                  label="Correct answer"
                  value={questionForm.answer}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, answer: e.target.value }))}
                />
                <Button type="submit" variant="secondary" className="w-full">
                  Add question
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </HRLayout>
  )
}

export default HRAssessments

