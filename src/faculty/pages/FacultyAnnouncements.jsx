import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import FormInput from '../../shared/components/FormInput'
import { Bell, Plus, Trash2, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { getFacultyAnnouncementsAPI, createAnnouncementAPI, deleteAnnouncementAPI } from '../../services/announcementAPI'
import { getFacultyClassesAPI } from '../../services/attendanceAPI'

const FacultyAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'medium',
    targetAudience: 'students',
    expiresAt: '',
    selectedClass: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadAnnouncements()
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      setLoadingClasses(true)
      const res = await getFacultyClassesAPI()
      if (res?.status === 200) {
        setClasses(res.data.classes || [])
      }
    } catch (error) {
      console.error('Error loading classes:', error)
    } finally {
      setLoadingClasses(false)
    }
  }

  const loadAnnouncements = async () => {
    try {
      setLoading(true)
      const res = await getFacultyAnnouncementsAPI()
      if (res?.status === 200) {
        setAnnouncements(res.data.announcements || [])
      } else {
        toast.error('Failed to load announcements')
      }
    } catch (error) {
      console.error('Error loading announcements:', error)
      toast.error('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        title: formData.title,
        message: formData.message,
        priority: formData.priority,
        targetAudience: formData.targetAudience,
        expiresAt: formData.expiresAt || null,
        classes: formData.selectedClass ? [formData.selectedClass] : []
      }

      const res = await createAnnouncementAPI(payload)
      if (res?.status === 201) {
        toast.success('Announcement created successfully')
        setShowCreateModal(false)
        setFormData({
          title: '',
          message: '',
          priority: 'medium',
          targetAudience: 'students',
          expiresAt: '',
          selectedClass: ''
        })
        loadAnnouncements()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to create announcement')
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      toast.error('Failed to create announcement')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    try {
      const res = await deleteAnnouncementAPI(id)
      if (res?.status === 200) {
        toast.success('Announcement deleted')
        loadAnnouncements()
      } else {
        toast.error('Failed to delete announcement')
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      toast.error('Failed to delete announcement')
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            High
          </span>
        )
      case 'medium':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Medium
          </span>
        )
      case 'low':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Low
          </span>
        )
      default:
        return null
    }
  }

  return (
    <FacultyLayout>
      <div className="space-y-8 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Announcements</h1>
            <p className="text-lg text-slate-600">Create and manage announcements for your classes</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Announcement
          </Button>
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <div className="text-slate-500">Loading announcements...</div>
          </Card>
        ) : announcements.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No announcements</h3>
            <p className="text-slate-500 mb-4">Create your first announcement to get started</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {announcements.map((announcement) => (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{announcement.title}</h3>
                        {getPriorityBadge(announcement.priority)}
                      </div>
                      <p className="text-sm text-slate-500 mb-1">
                        Posted on {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                      {announcement.expiresAt && (
                        <p className="text-xs text-slate-400">
                          Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(announcement._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap">{announcement.message}</p>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Target: {announcement.targetAudience}</span>
                      {announcement.classes && announcement.classes.length > 0 && (
                        <span>Classes: {announcement.classes.join(', ')}</span>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Announcement"
          size="lg"
        >
          <div className="space-y-4">
            <FormInput
              label="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter announcement title"
              required
            />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter announcement message"
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Target Audience *
                </label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="students">Students</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Target Class (Optional - leave empty for all students)
              </label>
              <select
                value={formData.selectedClass}
                onChange={(e) => setFormData({ ...formData, selectedClass: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.className} value={cls.className}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              label="Expiry Date (Optional)"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
            />

            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                onClick={handleCreate}
                loading={submitting}
                className="flex-1"
              >
                Create Announcement
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </FacultyLayout>
  )
}

export default FacultyAnnouncements

