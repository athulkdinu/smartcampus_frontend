import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { BookOpen, UploadCloud, Video, FileText, FileSpreadsheet, Trash2, Eye, Play, FileText as FileTextIcon, ArrowRight } from 'lucide-react'
import { getActiveFacultyProfile } from '../utils/getActiveFaculty'
import { skillProgramCatalogue } from '../../shared/data/workflowData'

const AcademicManagement = () => {
  const navigate = useNavigate()
  const selectedFaculty = useMemo(() => getActiveFacultyProfile(), [])

  const [uploadedMaterials, setUploadedMaterials] = useState([
    {
      id: 1,
      title: 'Binary Trees and Traversal',
      type: 'video',
      module: 'Module 4: Trees',
      section: 'CSE-2A',
      fileUrl: null,
      videoUrl: 'https://youtube.com/watch?v=example1',
      uploadedAt: '2025-01-10',
      instructor: selectedFaculty.name,
      subject: selectedFaculty.subject.name
    },
    {
      id: 2,
      title: 'AVL Tree Rotations',
      type: 'pdf',
      module: 'Module 4: Trees',
      section: 'CSE-2B',
      fileUrl: '/files/avl-rotations.pdf',
      videoUrl: null,
      uploadedAt: '2025-01-08',
      instructor: selectedFaculty.name,
      subject: selectedFaculty.subject.name
    },
    {
      id: 3,
      title: 'Stack Implementation Lab',
      type: 'ppt',
      module: 'Module 3: Stacks',
      section: 'CSE-2C',
      fileUrl: '/files/stack-lab.pptx',
      videoUrl: null,
      uploadedAt: '2025-01-05',
      instructor: selectedFaculty.name,
      subject: selectedFaculty.subject.name
    }
  ])

  const [uploadForm, setUploadForm] = useState({
    materialType: 'pdf',
    title: '',
    description: '',
    module: '',
    section: selectedFaculty.sections[0]?.name || '',
    videoUrl: '',
    file: null
  })

  const materialTypeIcons = {
    pdf: FileText,
    video: Video,
    ppt: FileSpreadsheet,
    notes: FileTextIcon
  }

  const materialTypeOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'video', label: 'Video Link', icon: Video },
    { value: 'ppt', label: 'PPT', icon: FileSpreadsheet },
    { value: 'notes', label: 'Notes', icon: FileTextIcon }
  ]

  const modules = [
    'Module 1: Introduction',
    'Module 2: Arrays & Linked Lists',
    'Module 3: Stacks',
    'Module 4: Trees',
    'Module 5: Graphs'
  ]

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadForm({ ...uploadForm, file })
    }
  }

  const handleUpload = (e) => {
    e.preventDefault()
    if (!uploadForm.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (uploadForm.materialType === 'video' && !uploadForm.videoUrl.trim()) {
      toast.error('Please enter a video URL')
      return
    }

    if (uploadForm.materialType !== 'video' && !uploadForm.file) {
      toast.error('Please select a file')
      return
    }

    const newMaterial = {
      id: Date.now(),
      title: uploadForm.title,
      type: uploadForm.materialType,
      module: uploadForm.module,
      section: uploadForm.section,
      fileUrl: uploadForm.file ? `/files/${uploadForm.file.name}` : null,
      videoUrl: uploadForm.videoUrl || null,
      uploadedAt: new Date().toISOString().split('T')[0],
      instructor: selectedFaculty.name,
      subject: selectedFaculty.subject.name
    }

    setUploadedMaterials([newMaterial, ...uploadedMaterials])
    toast.success('Material uploaded successfully')
    setUploadForm({
      materialType: 'pdf',
      title: '',
      description: '',
      module: '',
      section: selectedFaculty.sections[0]?.name || '',
      videoUrl: '',
      file: null
    })
  }

  const handleDelete = (id) => {
    setUploadedMaterials(uploadedMaterials.filter(m => m.id !== id))
    toast.success('Material deleted')
  }

  const materialTypeLabels = {
    pdf: 'PDF',
    video: 'Video',
    ppt: 'PPT',
    notes: 'Notes'
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
            <FileTextIcon className="w-4 h-4 mr-2" />
            Manage Assignments
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Module Overview */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Active Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.slice(0, 3).map((module, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-900 mb-2">{module}</h3>
                <p className="text-sm text-slate-600">
                  {uploadedMaterials.filter(m => m.module === module).length} materials uploaded
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Upload Lecture Materials */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Upload Lecture Materials</h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Material Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Material Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {materialTypeOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setUploadForm({ ...uploadForm, materialType: option.value, videoUrl: '', file: null })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          uploadForm.materialType === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${
                          uploadForm.materialType === option.value ? 'text-blue-600' : 'text-slate-400'
                        }`} />
                        <p className={`text-xs font-semibold ${
                          uploadForm.materialType === option.value ? 'text-blue-700' : 'text-slate-600'
                        }`}>
                          {option.label}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title */}
              <FormInput
                label="Title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="e.g., Binary Trees and Traversal"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Module */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Module
                </label>
                <select
                  value={uploadForm.module}
                  onChange={(e) => setUploadForm({ ...uploadForm, module: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select a module</option>
                  {modules.map((module) => (
                    <option key={module} value={module}>
                      {module}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Section
                </label>
                <select
                  value={uploadForm.section}
                  onChange={(e) => setUploadForm({ ...uploadForm, section: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {selectedFaculty.sections.map((section) => (
                    <option key={section.name} value={section.name}>
                      {section.name}
                    </option>
                  ))}
                </select>
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

            {/* File Upload or Video URL */}
            {uploadForm.materialType === 'video' ? (
              <FormInput
                label="Video URL"
                value={uploadForm.videoUrl}
                onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={uploadForm.materialType === 'pdf' ? '.pdf' : uploadForm.materialType === 'ppt' ? '.ppt,.pptx' : '*'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                <UploadCloud className="w-4 h-4 mr-2" />
                Upload Material
              </Button>
            </div>
          </form>
        </Card>

        {/* Uploaded Materials List */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Uploaded Materials</h2>
          {uploadedMaterials.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No materials uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedMaterials.map((material) => {
                const Icon = materialTypeIcons[material.type]
                return (
                  <div
                    key={material.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{material.title}</h3>
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                              {materialTypeLabels[material.type]}
                            </span>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
                              {material.section}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{material.module}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>Uploaded: {material.uploadedAt}</span>
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
                        onClick={() => handleDelete(material.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </motion.div>
    </FacultyLayout>
  )
}

export default AcademicManagement
