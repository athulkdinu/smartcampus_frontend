import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { Search, Play, Download, Video, FileText, BookOpen, Eye, FileSpreadsheet, Filter } from 'lucide-react'
import { lectures } from '../../data/academicData'

const LecturesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [moduleFilter, setModuleFilter] = useState('all')

  const typeIcons = {
    video: Video,
    pdf: FileText,
    ppt: FileSpreadsheet,
    lab: BookOpen,
    notes: FileText
  }

  const materialTypeLabels = {
    video: 'Video',
    pdf: 'PDF',
    ppt: 'PPT',
    lab: 'Lab Manual',
    notes: 'Notes'
  }

  // Extract unique modules/subjects from lectures (group by subject if no module)
  const modules = ['all', ...Array.from(new Set(lectures.map(l => l.module || l.subject || 'Uncategorized')))]

  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = lecture.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lecture.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (lecture.instructor && lecture.instructor.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = typeFilter === 'all' || lecture.type === typeFilter
    const moduleOrSubject = lecture.module || lecture.subject || 'Uncategorized'
    const matchesModule = moduleFilter === 'all' || moduleOrSubject === moduleFilter
    return matchesSearch && matchesType && matchesModule
  })

  // Group lectures by module or subject
  const lecturesByModule = filteredLectures.reduce((acc, lecture) => {
    const module = lecture.module || lecture.subject || 'Uncategorized'
    if (!acc[module]) {
      acc[module] = []
    }
    acc[module].push(lecture)
    return acc
  }, {})

  const handleViewMaterial = (lecture) => {
    if (lecture.type === 'video') {
      if (lecture.videoUrl) {
        window.open(lecture.videoUrl, '_blank')
      } else {
        // Placeholder for video - in real app, this would come from backend
        toast.info('Video link will be available soon')
      }
    } else {
      if (lecture.fileUrl) {
        window.open(lecture.fileUrl, '_blank')
      } else {
        // Placeholder for file download - in real app, this would come from backend
        toast.info('File download will be available soon')
      }
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
            <p className="text-sm uppercase tracking-wide text-slate-500">Academic & Campus</p>
            <h1 className="text-3xl font-bold text-slate-900">Academic Materials</h1>
            <p className="text-slate-600">Browse lecture materials, notes, videos, and study resources uploaded by your faculty</p>
          </div>
        </div>

        {/* Module Overview */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Available Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.slice(1, 4).map((module, idx) => {
              const moduleLectures = lectures.filter(l => (l.module || l.subject || 'Uncategorized') === module)
              return (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <h3 className="font-semibold text-slate-900 mb-2">{module}</h3>
                  <p className="text-sm text-slate-600">
                    {moduleLectures.length} materials available
                  </p>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Search and Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, subject, or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2">
              {['all', 'video', 'pdf', 'ppt', 'lab', 'notes'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    typeFilter === type
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white"
              >
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module === 'all' ? 'All Modules' : module}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Materials List - Organized by Module */}
        {filteredLectures.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No materials found matching your search</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(lecturesByModule).map(([module, moduleLectures]) => (
              <Card key={module}>
                <h2 className="text-xl font-bold text-slate-900 mb-6">{module}</h2>
                <div className="space-y-4">
                  {moduleLectures.map((lecture, idx) => {
                    const Icon = typeIcons[lecture.type] || FileText
                    const isVideo = lecture.type === 'video'
                    return (
                      <motion.div
                        key={lecture.id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-slate-900">{lecture.topic}</h3>
                                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                                  {materialTypeLabels[lecture.type] || lecture.type}
                                </span>
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
                                  {lecture.subject}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">{lecture.instructor || 'Faculty'}</p>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>{lecture.date || 'N/A'}</span>
                                {lecture.duration && <span>{lecture.duration}</span>}
                                {lecture.views && (
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {lecture.views} views
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant={isVideo ? 'primary' : 'secondary'}
                              size="sm"
                              onClick={() => handleViewMaterial(lecture)}
                            >
                              {isVideo ? (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Watch
                                </>
                              ) : (
                                <>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Materials', value: lectures.length, icon: FileText, color: 'from-slate-500 to-slate-600' },
            { label: 'Videos', value: lectures.filter(l => l.type === 'video').length, icon: Video, color: 'from-red-500 to-red-600' },
            { label: 'PDFs', value: lectures.filter(l => l.type === 'pdf').length, icon: FileText, color: 'from-blue-500 to-blue-600' },
            { label: 'Modules', value: modules.length - 1, icon: BookOpen, color: 'from-indigo-500 to-indigo-600' }
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </MainLayout>
  )
}

export default LecturesPage
