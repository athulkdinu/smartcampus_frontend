import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import FormInput from '../../shared/components/FormInput'
import { Plus, BookOpen, Edit, Globe, FileText, Users, CheckCircle2, Eye, Trash2 } from 'lucide-react'
import { getCoursesAPI, createCourseAPI, deleteCourseAPI, getCourseEnrollmentsAPI } from '../../services/skillCourseAPI'

const FacultySkillsManagement = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [courseForm, setCourseForm] = useState({
    title: '',
    shortDesc: '',
    longDesc: '',
    category: 'General',
    passThreshold: 60
  })

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const res = await getCoursesAPI({ mine: true })
      if (res?.status === 200) {
        setCourses(res.data.courses || [])
      } else {
        toast.error('Failed to load courses')
      }
    } catch (error) {
      console.error('Error loading courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    if (!courseForm.title.trim() || !courseForm.shortDesc.trim()) {
      toast.error('Title and short description are required')
      return
    }

    setCreating(true)
    try {
      const res = await createCourseAPI(courseForm)
      if (res?.status === 201) {
        toast.success('Course created successfully!')
        setShowCreateModal(false)
        setCourseForm({ title: '', shortDesc: '', longDesc: '', category: 'General', passThreshold: 60 })
        await loadCourses()
        navigate(`/faculty/skills/${res.data.course._id}`)
      } else {
        toast.error(res?.response?.data?.message || 'Failed to create course')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create course')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all enrollments and submissions.')) {
      return
    }

    try {
      const res = await deleteCourseAPI(courseId)
      if (res?.status === 200) {
        toast.success('Course deleted')
        await loadCourses()
      } else {
        toast.error('Failed to delete course')
      }
    } catch (error) {
      toast.error('Failed to delete course')
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'Published') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
          <Globe className="w-3 h-3" />
          Published
        </span>
      )
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
        <FileText className="w-3 h-3" />
        Draft
      </span>
    )
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Skill Development</h1>
            <p className="text-slate-600">Create and manage skill courses with gated rounds</p>
          </div>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Loading courses...</p>
            </div>
          </Card>
        ) : courses.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses created yet</h3>
              <p className="text-slate-500 mb-6">Get started by creating your first skill course</p>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Course
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
                        </div>
                        {getStatusBadge(course.status)}
                        <p className="text-sm text-slate-600 mt-2">{course.shortDesc}</p>
                        <p className="text-xs text-slate-500 mt-1">Category: {course.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-200">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/faculty/skills/${course._id}`)}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/faculty/skills/${course._id}/students`)}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Enrollments
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(course._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Course Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false)
            setCourseForm({ title: '', shortDesc: '', longDesc: '', category: 'General', passThreshold: 60 })
          }}
          title="Create New Course"
          size="md"
        >
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <FormInput
              label="Course Title"
              placeholder="e.g., Python Programming Fundamentals"
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              required
            />
            <FormInput
              label="Short Description"
              placeholder="Brief one-line description"
              value={courseForm.shortDesc}
              onChange={(e) => setCourseForm({ ...courseForm, shortDesc: e.target.value })}
              required
            />
            <FormInput
              label="Long Description (Optional)"
              placeholder="Detailed course description"
              value={courseForm.longDesc}
              onChange={(e) => setCourseForm({ ...courseForm, longDesc: e.target.value })}
              type="textarea"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Category"
                placeholder="e.g., Programming, Web Dev"
                value={courseForm.category}
                onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
              />
              <FormInput
                label="Pass Threshold (%)"
                type="number"
                min="0"
                max="100"
                value={courseForm.passThreshold}
                onChange={(e) => setCourseForm({ ...courseForm, passThreshold: parseInt(e.target.value) || 60 })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreateModal(false)
                  setCourseForm({ title: '', shortDesc: '', longDesc: '', category: 'General', passThreshold: 60 })
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={creating}>
                Create Course
              </Button>
            </div>
          </form>
        </Modal>
      </motion.div>
    </FacultyLayout>
  )
}

export default FacultySkillsManagement
