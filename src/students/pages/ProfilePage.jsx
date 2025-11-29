import { motion } from 'framer-motion'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { User, Mail, Phone, MapPin, Edit2, Save } from 'lucide-react'

const ProfilePage = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile & Settings</h1>
          <p className="text-slate-600">Manage your profile information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                S
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Student Name</h2>
              <p className="text-slate-600 mb-4">ID: STU2024</p>
              <Button variant="secondary" size="sm" className="w-full">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Photo
              </Button>
            </div>
          </Card>

          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                <Button variant="primary" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Full Name" defaultValue="athul k Dinu" />
                <FormInput label="Student ID" defaultValue="STU2024" disabled />
                <FormInput label="Email" type="email" defaultValue="athul@gmail.com" />
                <FormInput label="Phone" type="tel" defaultValue="+91 9847000000" />
                <FormInput label="Address" defaultValue="Kerala, India" />
                <FormInput label="Department" defaultValue="Computer Science and Engineering" />
              </div>
            </Card>
          </div>
        </div>

        {/* Settings */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Settings</h2>
          <div className="space-y-4">
            {[
              { label: 'Email Notifications', description: 'Receive email updates about your academics' },
              { label: 'SMS Notifications', description: 'Get important updates via SMS' },
              { label: 'Dark Mode', description: 'Switch to dark theme' }
            ].map((setting, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div>
                  <h3 className="font-semibold text-slate-900">{setting.label}</h3>
                  <p className="text-sm text-slate-600">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default ProfilePage

