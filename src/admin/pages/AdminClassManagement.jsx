import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Users, BookOpen, PlusCircle } from 'lucide-react'
import { createClassAPI, getAllClassesAdminAPI } from '../../services/api'

const AdminClassManagement = () => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    className: '',
    department: ''
  })

  const loadClasses = async () => {
    try {
      setLoading(true)
      const res = await getAllClassesAdminAPI()
      if (res?.status === 200) {
        setClasses(res.data.classes || [])
      } else {
        toast.error('Failed to load classes')
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to load classes'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClasses()
  }, [])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateClass = async (e) => {
    e.preventDefault()
    if (!form.className.trim() || !form.department.trim()) {
      toast.error('Class name and department are required')
      return
    }

    try {
      setSaving(true)
      const payload = {
        className: form.className.trim(),
        department: form.department.trim()
      }
      const res = await createClassAPI(payload)
      if (res?.status === 201) {
        toast.success('Class created')
        setForm({ className: '', department: '' })
        await loadClasses()
      } else {
        const message = res?.response?.data?.message || 'Failed to create class'
        toast.error(message)
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Something went wrong'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Academic Structure</p>
            <h1 className="text-3xl font-bold text-slate-900">Class Management</h1>
            <p className="text-slate-600 text-sm">
              Create classes, map faculty, and manage student groupings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Class Form */}
          <Card className="lg:col-span-1">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              Create New Class
            </h2>
            <form className="space-y-4" onSubmit={handleCreateClass}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  value={form.className}
                  onChange={e => handleChange('className', e.target.value)}
                  placeholder="e.g., CSE-2A"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={form.department}
                  onChange={e => handleChange('department', e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" loading={saving}>
                Create Class
              </Button>
            </form>
          </Card>

          {/* Class List */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-slate-700" />
                Classes
              </h2>
              <span className="text-xs text-slate-500">
                {classes.length} classes configured
              </span>
            </div>
            {loading ? (
              <p className="text-sm text-slate-500">Loading classes...</p>
            ) : classes.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p>No classes created yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">Class</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">Department</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((cls, idx) => (
                      <motion.tr
                        key={cls._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-slate-900">
                          {cls.className}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {cls.department}
                        </td>
                        <td className="py-3 px-4 text-xs">
                          <div className="flex flex-wrap gap-2">
                            <Button variant="secondary" size="xs">
                              Assign Class Teacher
                            </Button>
                            <Button variant="ghost" size="xs">
                              Subjects & Faculty
                            </Button>
                            <Button variant="ghost" size="xs">
                              View Students
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </motion.div>
    </AdminLayout>
  )
}

export default AdminClassManagement


