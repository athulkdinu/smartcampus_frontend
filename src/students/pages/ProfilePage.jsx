import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { User, Mail, Phone, MapPin, Save } from 'lucide-react'
import { getProfileAPI, updateProfileAPI } from '../../services/api'

const classOptions = ['CS1', 'CS2', 'CS3']
const departmentOptions = ['Computer Science', 'Electronics', 'Mechanical', 'Civil']

const ProfilePage = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    studentID: '',
    className: '',
    phone: '',
    address: '',
    department: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfileAPI()
        if (res?.status === 200 && res.data?.user) {
          setProfile({
            name: res.data.user.name || '',
            email: res.data.user.email || '',
            studentID: res.data.user.studentID || '',
            className: res.data.user.className || '',
            phone: res.data.user.phone || '',
            address: res.data.user.address || '',
            department: res.data.user.department || ''
          })
        } else {
          toast.error('Unable to load profile')
        }
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to load profile'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!profile.name.trim()) newErrors.name = 'Full name is required'
    if (!profile.studentID.trim()) newErrors.studentID = 'Student ID is required'
    if (!profile.className.trim()) newErrors.className = 'Class is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      setSaving(true)
      const payload = {
        name: profile.name.trim(),
        studentID: profile.studentID.trim(),
        className: profile.className,
        phone: profile.phone,
        address: profile.address,
        department: profile.department
      }
      const res = await updateProfileAPI(payload)
      if (res?.status === 200) {
        toast.success('Profile updated successfully')
        if (res.data?.user) {
          setProfile(prev => ({
            ...prev,
            name: res.data.user.name || prev.name,
            studentID: res.data.user.studentID || prev.studentID,
            className: res.data.user.className || prev.className,
            phone: res.data.user.phone || prev.phone,
            address: res.data.user.address || prev.address,
            department: res.data.user.department || prev.department
          }))
        }
      } else {
        const message = res?.response?.data?.message || 'Failed to update profile'
        toast.error(message)
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Something went wrong'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const initialLetter = profile.name?.charAt(0)?.toUpperCase() || 'S'

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Profile</h1>
          <p className="text-slate-600">Manage your profile information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card (no photo editing) */}
          <Card>
            <div className="text-center space-y-3">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg">
                {initialLetter}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{profile.name || 'Student Name'}</h2>
              <p className="text-slate-600 mb-1 flex items-center justify-center gap-1 text-sm">
                <Mail className="w-4 h-4" />
                <span>{profile.email || 'email@campus.edu'}</span>
              </p>
              {profile.studentID && (
                <p className="text-xs text-slate-500">ID: {profile.studentID}</p>
              )}
              {profile.className && (
                <p className="text-xs text-slate-500">Class: {profile.className}</p>
              )}
            </div>
          </Card>

          {/* Personal Information (editable) */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
              {loading ? (
                <p className="text-sm text-slate-500">Loading profile...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormInput
                      label="Full Name"
                      value={profile.name}
                      onChange={e => handleChange('name', e.target.value)}
                      required
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <FormInput
                      label="Email"
                      type="email"
                      value={profile.email}
                      onChange={() => {}}
                      disabled
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Email cannot be changed after registration.
                    </p>
                  </div>
                  <div>
                    <FormInput
                      label="Student ID"
                      value={profile.studentID}
                      onChange={e => handleChange('studentID', e.target.value)}
                      required
                    />
                    {errors.studentID && (
                      <p className="mt-1 text-xs text-red-600">{errors.studentID}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Class / Section <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={profile.className}
                      onChange={e => handleChange('className', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none text-sm"
                    >
                      <option value="">Select class</option>
                      {classOptions.map(cls => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                    {errors.className && (
                      <p className="mt-1 text-xs text-red-600">{errors.className}</p>
                    )}
                  </div>
                  <div>
                    <FormInput
                      label="Phone Number"
                      type="tel"
                      value={profile.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      iconLeft={<Phone className="w-4 h-4 text-slate-400" />}
                    />
                  </div>
                  <div>
                    <FormInput
                      label="Address"
                      value={profile.address}
                      onChange={e => handleChange('address', e.target.value)}
                      iconLeft={<MapPin className="w-4 h-4 text-slate-400" />}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Department
                    </label>
                    <select
                      value={profile.department}
                      onChange={e => handleChange('department', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none text-sm"
                    >
                      <option value="">Select department</option>
                      {departmentOptions.map(dep => (
                        <option key={dep} value={dep}>
                          {dep}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  )
}

export default ProfilePage

