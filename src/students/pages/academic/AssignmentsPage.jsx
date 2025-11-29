import { motion } from 'framer-motion'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { FileText, Clock, Paperclip, Filter, Upload, AlertCircle, CheckCircle2, Share2 } from 'lucide-react'
import { assignments } from '../../data/academicData'
import { useState } from 'react'

const AssignmentsPage = () => {
  const [filter, setFilter] = useState('all')
  const pending = assignments.filter(item => item.status !== 'submitted')
  const totalAttachments = assignments.reduce((acc, curr) => acc + curr.attachments, 0)

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : filter === 'pending' 
      ? pending 
      : assignments.filter(item => item.status === 'submitted')

  const getReviewStateStyles = (state) => {
    switch (state) {
      case 'accepted':
        return 'bg-green-50 text-green-700'
      case 'in-review':
        return 'bg-blue-50 text-blue-700'
      case 'needs-resubmission':
        return 'bg-amber-50 text-amber-700'
      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Assignments Workspace</h1>
            <p className="text-slate-600">Track deliverables, due dates, attachments and faculty feedback</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="primary" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Submission
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Assignments', value: assignments.length, icon: FileText, color: 'from-slate-500 to-slate-600' },
            { label: 'Pending', value: pending.length, icon: AlertCircle, color: 'from-amber-500 to-amber-600' },
            { label: 'Attachments', value: totalAttachments, icon: Paperclip, color: 'from-blue-500 to-blue-600' }
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
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{stat.label}</p>
                      <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2">
          {['all', 'pending', 'submitted'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                filter === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssignments.map((assignment, idx) => {
            const isSubmitted = assignment.status === 'submitted'
            const submissionMeta = assignment.submissionMeta
            const reviewBadge = submissionMeta ? submissionMeta.status : assignment.reviewState
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg">
                          {assignment.subject}
                        </span>
                        {isSubmitted && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{assignment.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{assignment.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span>Due: <span className="font-semibold text-slate-900">{assignment.dueDate}</span></span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isSubmitted
                          ? 'bg-green-50 text-green-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Paperclip className="w-3 h-3" />
                        <span>{assignment.attachments} attachment(s)</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">{assignment.timeLeft}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Faculty queue</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getReviewStateStyles(reviewBadge)}`}>
                          {reviewBadge?.replace('-', ' ') || 'pending'}
                        </span>
                      </div>
                      {submissionMeta ? (
                        <p className="text-slate-600 text-xs">
                          Submitted on {submissionMeta.submittedOn} · {submissionMeta.fileName}
                        </p>
                      ) : (
                        <p className="text-slate-500 text-xs">No submission yet. Upload before due date.</p>
                      )}
                    </div>

                    <Button variant={isSubmitted ? 'secondary' : 'primary'} size="sm" className="w-full">
                      {isSubmitted ? 'View Submission' : 'Submit Now'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Submission Review Tracker</h2>
              <p className="text-slate-500 text-sm">Mirrors the faculty review table so you always know the decision stage.</p>
            </div>
          </div>
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const submissionMeta = assignment.submissionMeta
              const facultyState = submissionMeta ? submissionMeta.status : assignment.reviewState
              return (
                <div key={assignment.id} className="p-4 rounded-2xl border border-slate-100 bg-white/60 flex flex-col gap-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{assignment.subject}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{assignment.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Due {assignment.dueDate}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getReviewStateStyles(facultyState)}`}>
                        {facultyState?.replace('-', ' ') || 'pending'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 rounded-xl bg-slate-50">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Faculty workspace</p>
                      <p className="text-slate-700">{assignment.reviewState}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Your submission</p>
                      <p className="text-slate-700">
                        {submissionMeta ? submissionMeta.fileName : 'Not uploaded yet'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Shared with faculty</p>
                      <Share2 className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default AssignmentsPage
