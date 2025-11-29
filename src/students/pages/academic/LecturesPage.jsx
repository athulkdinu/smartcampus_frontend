import { motion } from 'framer-motion'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { Search, Filter, Play, Download, Video, FileText, BookOpen, Eye } from 'lucide-react'
import { lectures } from '../../data/academicData'
import { useState } from 'react'

const LecturesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const typeIcons = {
    video: Video,
    pdf: FileText,
    lab: BookOpen
  }

  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = lecture.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lecture.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || lecture.type === typeFilter
    return matchesSearch && matchesType
  })

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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Lecture Library</h1>
            <p className="text-slate-600">Browse recorded sessions, documents, lab manuals and resources</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search lectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2">
              {['all', 'video', 'pdf', 'lab'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    typeFilter === type
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>

        {/* Lectures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLectures.map((lecture, idx) => {
            const Icon = typeIcons[lecture.type] || FileText
            const isVideo = lecture.type === 'video'
            return (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                          {lecture.subject}
                        </span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg capitalize">
                          {lecture.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{lecture.topic}</h3>
                      <p className="text-sm text-slate-600 mb-3">{lecture.instructor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Icon className="w-3 h-3" />
                      {lecture.type}
                    </span>
                    <span>{lecture.date}</span>
                    <span>{lecture.duration}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {lecture.views} views
                    </span>
                  </div>

                  <Button
                    variant={isVideo ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {isVideo ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play Recording
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Resource
                      </>
                    )}
                  </Button>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {filteredLectures.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No lectures found matching your search</p>
            </div>
          </Card>
        )}
      </motion.div>
    </MainLayout>
  )
}

export default LecturesPage
