import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import MainLayout from '../../../shared/layouts/MainLayout'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import { Search, Play, Download, Video, FileText, BookOpen, Eye } from 'lucide-react'
import { getStudentLecturesAPI } from '../../../services/lectureAPI'

const LecturesPage = () => {
  const [lectureMaterials, setLectureMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadMaterials()
  }, [])

  const loadMaterials = async () => {
    try {
      setLoading(true)
      const res = await getStudentLecturesAPI()
      if (res?.status === 200) {
        setLectureMaterials(res.data.lectureMaterials || [])
      } else {
        toast.error('Failed to load lecture materials')
      }
    } catch (error) {
      console.error('Error loading materials:', error)
      toast.error('Failed to load lecture materials')
    } finally {
      setLoading(false)
    }
  }

  const filteredMaterials = lectureMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (material.module && material.module.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (material.description && material.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  const handleViewMaterial = (material) => {
    if (material.videoUrl) {
      window.open(material.videoUrl, '_blank')
    } else if (material.fileUrl) {
      window.open(material.fileUrl, '_blank')
    } else {
      toast.info('No file or video available for this material')
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

        {/* Search */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials by title, module, or description..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Materials List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-slate-500">Loading materials...</p>
            </div>
          </Card>
        ) : filteredMaterials.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchQuery ? 'No materials found matching your search' : 'No lecture materials available yet'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMaterials.map((material, idx) => {
              const hasFile = !!material.fileUrl
              const hasVideo = !!material.videoUrl
              
              return (
                <motion.div
                  key={material._id || material.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          hasVideo ? 'bg-red-50' : 'bg-blue-50'
                        }`}>
                          {hasVideo ? (
                            <Video className="w-6 h-6 text-red-600" />
                          ) : (
                            <FileText className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900">{material.title}</h3>
                            {material.module && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                                {material.module}
                              </span>
                            )}
                            {material.classId?.className && (
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg">
                                {material.classId.className}
                              </span>
                            )}
                          </div>
                          {material.description && (
                            <p className="text-sm text-slate-600 mb-2">{material.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                            {material.facultyId?.name && (
                              <span>By: {material.facultyId.name}</span>
                            )}
                            <span>Uploaded: {new Date(material.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {hasVideo && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleViewMaterial(material)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Watch Video
                          </Button>
                        )}
                        {hasFile && (
                          <Button
                            variant={hasVideo ? "secondary" : "primary"}
                            size="sm"
                            onClick={() => handleViewMaterial(material)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                        {!hasFile && !hasVideo && (
                          <span className="text-xs text-slate-500">No file available</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Materials', value: lectureMaterials.length, icon: FileText, color: 'from-slate-500 to-slate-600' },
            { label: 'With Videos', value: lectureMaterials.filter(m => m.videoUrl).length, icon: Video, color: 'from-red-500 to-red-600' },
            { label: 'With Files', value: lectureMaterials.filter(m => m.fileUrl).length, icon: BookOpen, color: 'from-blue-500 to-blue-600' }
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
