import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { BookOpen, UploadCloud, Video, FileText, FileSpreadsheet, ClipboardList, Trash2, Eye, Play, CheckCircle2, XCircle, RefreshCw, Sparkles } from 'lucide-react'
import { getActiveFacultyProfile } from '../utils/getActiveFaculty'
import { assignmentWorkflows, skillProgramCatalogue } from '../../shared/data/workflowData'

const AcademicManagement = () => {
  const selectedFaculty = useMemo(() => getActiveFacultyProfile(), [])
  
  // Dummy data for uploaded materials (matches student lecture library structure)
  const [assignmentBoard, setAssignmentBoard] = useState(
    assignmentWorkflows.filter((assignment) => assignment.subject === selectedFaculty.subject.name)
  )
  const [skillPrograms, setSkillPrograms] = useState(
    skillProgramCatalogue.filter(program => program.createdBy === selectedFaculty.name)
  )
  const [skillForm, setSkillForm] = useState({
    title: '',
    description: '',
    duration: '',
    format: 'Hybrid',
    materials: ''
  })

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
    notes: FileText,
    assignment: ClipboardList
  }

  const materialTypeOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'video', label: 'Video Link', icon: Video },
    { value: 'ppt', label: 'PPT', icon: FileSpreadsheet },
    { value: 'notes', label: 'Notes', icon: FileText },
    { value: 'assignment', label: 'Assignment', icon: ClipboardList }
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
    if (!uploadForm.module) {
      toast.error('Please select a module')
      return
    }
    if (uploadForm.materialType === 'video' && !uploadForm.videoUrl.trim()) {
      toast.error('Please enter a video link')
      return
    }
    if (uploadForm.materialType !== 'video' && !uploadForm.file) {
      toast.error('Please select a file to upload')
      return
    }

    const newMaterial = {
      id: uploadedMaterials.length + 1,
      title: uploadForm.title,
      type: uploadForm.materialType,
      module: uploadForm.module,
      section: uploadForm.section,
      fileUrl: uploadForm.materialType !== 'video' ? `/files/${uploadForm.file?.name}` : null,
      videoUrl: uploadForm.materialType === 'video' ? uploadForm.videoUrl : null,
      uploadedAt: new Date().toISOString().split('T')[0],
      instructor: selectedFaculty.name,
      subject: selectedFaculty.subject.name
    }

    setUploadedMaterials([newMaterial, ...uploadedMaterials])
    toast.success(`"${uploadForm.title}" uploaded successfully`)
    
    // Reset form
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
    setUploadedMaterials(uploadedMaterials.filter(material => material.id !== id))
    toast.success('Material deleted successfully')
  }

  const handleSubmissionDecision = (assignmentId, submissionId, decision) => {
    setAssignmentBoard(prev =>
      prev.map(assignment => {
        if (assignment.id !== assignmentId) return assignment
        return {
          ...assignment,
          reviewState: decision === 'accepted' ? 'Completed' : assignment.reviewState,
          submissions: assignment.submissions.map(submission =>
            submission.id === submissionId
              ? { ...submission, status: decision }
              : submission
          )
        }
      })
    )
    toast.success(`Submission ${decision.replace('-', ' ')}`)
  }

  const handleSkillPublish = (e) => {
    e.preventDefault()
    if (!skillForm.title.trim() || !skillForm.duration.trim()) {
      toast.error('Fill in title and duration')
      return
    }

    const newProgram = {
      id: `SKL-${Math.floor(Math.random() * 300 + 800)}`,
      title: skillForm.title,
      description: skillForm.description,
      duration: skillForm.duration,
      format: skillForm.format,
      materials: skillForm.materials ? skillForm.materials.split(',').map(item => item.trim()).filter(Boolean) : [],
      status: 'published',
      createdBy: selectedFaculty.name,
      publishedOn: new Date().toISOString().split('T')[0],
      sections: selectedFaculty.sections.map(section => section.name),
      highlight: 'Newly published'
    }

    setSkillPrograms([newProgram, ...skillPrograms])
    toast.success('Skill program published for students')
    setSkillForm({
      title: '',
      description: '',
      duration: '',
      format: 'Hybrid',
      materials: ''
    })
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
            <p className="text-sm uppercase tracking-wide text-slate-500">Academic Management</p>
            <h1 className="text-3xl font-bold text-slate-900">Manage {selectedFaculty.subject.name} Materials</h1>
            <p className="text-slate-600">Upload and manage lecture materials for your students</p>
          </div>
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
                <div className="grid grid-cols-5 gap-2">
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

            {/* Description */}
            <FormInput
              label="Description"
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              placeholder="Brief description of the material"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Module Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select Module
                </label>
                <select
                  value={uploadForm.module}
                  onChange={(e) => setUploadForm({ ...uploadForm, module: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                  required
                >
                  <option value="">Select a module</option>
                  {modules.map((module) => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
              </div>

              {/* Section Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select Section
                </label>
                <select
                  value={uploadForm.section}
                  onChange={(e) => setUploadForm({ ...uploadForm, section: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                  required
                >
                  {selectedFaculty.sections.map((section) => (
                    <option key={section.name} value={section.name}>{section.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Upload or Video Link */}
            {uploadForm.materialType === 'video' ? (
              <FormInput
                label="Video Link"
                value={uploadForm.videoUrl}
                onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
                placeholder="YouTube or Drive link"
                required
              />
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Upload File
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept={uploadForm.materialType === 'pdf' ? '.pdf' : uploadForm.materialType === 'ppt' ? '.ppt,.pptx' : '*'}
                      className="hidden"
                      required
                    />
                    <div className="flex items-center gap-2 text-slate-600">
                      <UploadCloud className="w-5 h-5" />
                      <span>{uploadForm.file ? uploadForm.file.name : 'Choose file'}</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full">
              <UploadCloud className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
          </form>
        </Card>

        {/* Uploaded Materials Library */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Uploaded Materials</h2>
              <p className="text-slate-600">Manage all your uploaded lecture materials</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
              {uploadedMaterials.length} materials
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploadedMaterials.map((material, idx) => {
              const Icon = materialTypeIcons[material.type] || FileText
              const isVideo = material.type === 'video'
              return (
                <motion.div
                  key={material.id}
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
                            {material.subject}
                          </span>
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg capitalize">
                            {material.type}
                          </span>
                          <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-lg">
                            {material.section}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{material.title}</h3>
                        <p className="text-sm text-slate-600 mb-1">{material.module}</p>
                        <p className="text-xs text-slate-500">{material.instructor}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {material.type}
                      </span>
                      <span>{material.uploadedAt}</span>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant={isVideo ? 'primary' : 'secondary'}
                        size="sm"
                        className="flex-1"
                      >
                        {isVideo ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            View
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(material.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {uploadedMaterials.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No materials uploaded yet</p>
                <p className="text-sm text-slate-400 mt-2">Upload your first lecture material above</p>
              </div>
            </Card>
          )}
        </div>

        {/* Assignment Review */}
        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Assignments ↔ Students</p>
              <h2 className="text-2xl font-bold text-slate-900">Assignment Submissions Review</h2>
              <p className="text-slate-600 text-sm">Decisions made here sync instantly with the student workspace.</p>
            </div>
            <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
              {assignmentBoard.reduce((acc, item) => acc + item.submissions.length, 0)} submissions
            </span>
          </div>
          <div className="space-y-5">
            {assignmentBoard.map((assignment) => (
              <div key={assignment.id} className="rounded-2xl border border-slate-100 p-4 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{assignment.section}</p>
                    <h3 className="text-xl font-semibold text-slate-900">{assignment.title}</h3>
                    <p className="text-sm text-slate-500">Due {assignment.dueDate}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {assignment.reviewState}
                  </span>
                </div>
                <div className="space-y-3">
                  {assignment.submissions.map((submission) => (
                    <div key={submission.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{submission.studentName}</p>
                          <p className="text-xs text-slate-500">submitted {submission.submittedOn}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          submission.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-700'
                            : submission.status === 'needs-resubmission'
                              ? 'bg-amber-50 text-amber-700'
                              : submission.status === 'rejected'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-blue-50 text-blue-700'
                        }`}>
                          {submission.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="px-3 py-1 rounded-full bg-white border border-slate-200">
                          {submission.fileName}
                        </span>
                        <span>{submission.remarks}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="success" onClick={() => handleSubmissionDecision(assignment.id, submission.id, 'accepted')}>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleSubmissionDecision(assignment.id, submission.id, 'needs-resubmission')}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Request Resubmission
                        </Button>
                        <Button size="sm" variant="ghost" className="text-rose-600 hover:text-rose-700" onClick={() => handleSubmissionDecision(assignment.id, submission.id, 'rejected')}>
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Skill Program Manager */}
        <Card>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Skills Pipeline</p>
              <h2 className="text-2xl font-bold text-slate-900">Skill Program Manager</h2>
              <p className="text-slate-600 text-sm">Publish programmes that instantly surface inside the student skill hub.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-semibold">
              {skillPrograms.length} programs
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleSkillPublish} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Program Title</label>
                <input
                  type="text"
                  value={skillForm.title}
                  onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g., Systems Programming Lab"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={skillForm.description}
                  onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={skillForm.duration}
                    onChange={(e) => setSkillForm({ ...skillForm, duration: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="4 weeks"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Format</label>
                  <select
                    value={skillForm.format}
                    onChange={(e) => setSkillForm({ ...skillForm, format: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option>Hybrid</option>
                    <option>Virtual</option>
                    <option>On-campus</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Materials</label>
                <input
                  type="text"
                  value={skillForm.materials}
                  onChange={(e) => setSkillForm({ ...skillForm, materials: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Comma separated: Syllabus.pdf, Demo.mp4"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Publish Program
              </Button>
            </form>
            <div className="space-y-4">
              {skillPrograms.map((program) => (
                <div key={program.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{program.title}</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-emerald-50 text-emerald-700">
                      {program.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{program.description || 'No description added yet.'}</p>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p><strong className="text-slate-700">Duration:</strong> {program.duration}</p>
                    <p><strong className="text-slate-700">Mode:</strong> {program.format}</p>
                    <p><strong className="text-slate-700">Materials:</strong> {program.materials.join(', ') || 'None'}</p>
                  </div>
                </div>
              ))}
              {skillPrograms.length === 0 && (
                <div className="p-6 rounded-2xl border border-dashed border-slate-200 text-center text-slate-500 text-sm">
                  Publish your first skill program to send it to students.
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </FacultyLayout>
  )
}

export default AcademicManagement

