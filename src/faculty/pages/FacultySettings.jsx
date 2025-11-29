import { useMemo, useState } from 'react'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Shield, Bell, Save } from 'lucide-react'
import { getActiveFacultyProfile } from '../utils/getActiveFaculty'

const toggleClass = (enabled) =>
  `w-12 h-6 rounded-full transition-all duration-200 ${enabled ? 'bg-blue-600' : 'bg-slate-300'}`

const FacultySettings = () => {
  const selectedFaculty = useMemo(() => getActiveFacultyProfile(), [])
  const [preferences, setPreferences] = useState({
    notifications: true,
    autoShare: false,
    weeklyDigest: true
  })

  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <FacultyLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Settings</p>
            <h1 className="text-3xl font-bold text-slate-900">Control preferences & security</h1>
            <p className="text-slate-600">Configure how {selectedFaculty.name} receives alerts and shares data.</p>
          </div>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Notifications</h2>
            <div className="space-y-4">
              {[
                { key: 'notifications', label: 'Alert me about attendance drops' },
                { key: 'autoShare', label: 'Auto-share announcements with admin' },
                { key: 'weeklyDigest', label: 'Send weekly digest on Fridays' }
              ].map(item => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">Applies to all sections of {selectedFaculty.subject.code}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePreference(item.key)}
                    className={toggleClass(preferences[item.key])}
                  >
                    <span
                      className={`block w-6 h-6 bg-white rounded-full shadow transform transition ${
                        preferences[item.key] ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-500">Security</p>
                  <p className="text-lg font-semibold text-slate-900">2FA enabled</p>
                  <p className="text-xs text-slate-500">Last reset 12 days ago</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Delivery channels</p>
                  <p className="text-sm text-slate-600">Email · SMS · Smart Campus mobile app</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </FacultyLayout>
  )
}

export default FacultySettings
