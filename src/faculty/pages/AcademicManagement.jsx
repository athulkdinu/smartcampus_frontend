import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { BookOpen, UploadCloud, Trash2, Eye, Play, FileText, ArrowRight } from 'lucide-react'
import { getFacultyClassesAPI } from '../../services/attendanceAPI'
import { createLectureMaterialAPI, getFacultyLecturesAPI, deleteLectureMaterialAPI } from '../../services/lectureAPI'

const AcademicManagement = () => {
  const navigate = useNavigate()
  const [facultyClasses, setFacultyClasses] = useState([])
  const [uploadedMaterials, setUploadedMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const [uploadForm, setUploadForm] = useState({
    classId: '',
    title: '',
    description: '',
    module: '',
    videoUrl: '',
    file: null
  })

  useEffect(() => {
    loadClasses()
    loadMaterials()
  }, [])

  const loadClasses = async () => {
    try {
      const res = await getFacultyClassesAPI()
      if (res?.status === 200) {
        setFacultyClasses(res.data.classes || [])
      }
    } catch (error) {
      console.error('Error loading classes:', error)
    }
  }

  const loadMaterials = async () => {
    try {
      setLoading(true)
      const res = await getFacultyLecturesAPI()
      if (res?.status === 200) {
        setUploadedMaterials(res.data.lectureMaterials || [])
      } else {
        toast.error('Failed to load materials')
      }
    } catch (error) {
      console.error('Error loading materials:', error)
      toast.error('Failed to load materials')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadForm({ ...uploadForm, file })
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!uploadForm.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!uploadForm.classId) {
      toast.error('Please select a class')
      return
    }

    try {
      setUploading(true)
      
      // Build FormData
      const formData = new FormData()
      formData.append('title', uploadForm.title)
      formData.append('classId', uploadForm.classId)
      if (uploadForm.description) {
        formData.append('description', uploadForm.description)
      }
      if (uploadForm.module) {
        formData.append('module', uploadForm.module)
      }
      if (uploadForm.videoUrl) {
        formData.append('videoUrl', uploadForm.videoUrl)
      }
      if (uploadForm.file) {
        formData.append('file', uploadForm.file)
      }

      const res = await createLectureMaterialAPI(formData)

      if (res?.status === 201) {
        toast.success('Lecture material published')
        setUploadForm({
          classId: '',
          title: '',
          description: '',
          module: '',
          videoUrl: '',
          file: null
        })
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ''
        await loadMaterials()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to upload material')
      }
    } catch (error) {
      console.error('Error uploading material:', error)
      toast.error(error?.response?.data?.message || 'Failed to upload material')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lecture material?')) {
      return
    }

    try {
      const res = await deleteLectureMaterialAPI(id)
      if (res?.status === 200) {
        toast.success('Lecture material deleted')
        await loadMaterials()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to delete material')
      }
    } catch (error) {
      console.error('Error deleting material:', error)
      toast.error(error?.response?.data?.message || 'Failed to delete material')
    }
  }

  return (
    <FacultyLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Teaching</p>
            <h1 className="text-3xl font-bold text-slate-900">Academic Materials</h1>
            <p className="text-slate-600">Upload and manage lecture materials, notes, and study resources for your students</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate('/faculty/assignments')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Manage Assignments
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Upload Lecture Materials */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Upload Lecture Materials</h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Class *
                </label>
                <select
                  value={uploadForm.classId}
                  onChange={(e) => setUploadForm({ ...uploadForm, classId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="">Select a class</option>
                  {facultyClasses.map((cls) => (
                    <option key={cls._id || cls.id} value={cls._id || cls.id}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="e.g., Binary Trees and Traversal"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Module - Now text input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Module (Optional)
                </label>
                <input
                  type="text"
                  value={uploadForm.module}
                  onChange={(e) => setUploadForm({ ...uploadForm, module: e.target.value })}
                  placeholder="e.g., Module 1: Introduction"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={uploadForm.videoUrl}
                  onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Brief description of the material..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Upload File (Optional)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary" disabled={uploading}>
                <UploadCloud className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Material'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Uploaded Materials List */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Uploaded Materials</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading materials...</p>
            </div>
          ) : uploadedMaterials.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No materials uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedMaterials.map((material) => (
                <div
                  key={material._id || material.id}
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-900">{material.title}</h3>
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
                            {material.classId?.className || 'Unknown Class'}
                          </span>
                          {material.module && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                              {material.module}
                            </span>
                          )}
                        </div>
                        {material.description && (
                          <p className="text-sm text-slate-600 mb-2">{material.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                          <span>Uploaded: {new Date(material.createdAt).toLocaleDateString()}</span>
                          {material.videoUrl && (
                            <a
                              href={material.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              Watch Video
                            </a>
                          )}
                          {material.fileUrl && (
                            <a
                              href={material.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              View File
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(material._id || material.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </FacultyLayout>
  )
}

export default AcademicManagement
