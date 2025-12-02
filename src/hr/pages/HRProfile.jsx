import { useState } from 'react'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import FormInput from '../../shared/components/FormInput'
import Button from '../../shared/components/Button'

const HRProfile = () => {
  const [profile, setProfile] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    location: ''
  })

  const handleChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    // For now we just keep this in local state.
    // Later this can be replaced with an API call to save HR profile.
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white p-6 border border-white/10">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">HR Profile</p>
          <h1 className="text-3xl font-bold mt-1">Company & contact details</h1>
          <p className="text-slate-300 mt-2">
            This information will be used to pre-fill job postings and student-facing views.
          </p>
        </div>

        <Card className="border border-slate-100/10 bg-white/85 backdrop-blur">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Company Name"
                value={profile.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                required
              />
              <FormInput
                label="HR Name / Contact Person"
                value={profile.contactPerson}
                onChange={(e) => handleChange('contactPerson', e.target.value)}
                required
              />
              <FormInput
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
              <FormInput
                label="Phone"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
              <FormInput
                label="Website (optional)"
                value={profile.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://"
              />
              <FormInput
                label="Location"
                value={profile.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                Save Profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </HRLayout>
  )
}

export default HRProfile


