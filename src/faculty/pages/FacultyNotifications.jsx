import { motion } from 'framer-motion'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Bell } from 'lucide-react'

// Notifications will be fetched from backend API in future
const FacultyNotifications = () => {

  return (
    <FacultyLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Notifications</p>
            <h1 className="text-3xl font-bold text-slate-900">Stay on top of campus updates</h1>
            <p className="text-slate-600">Announcements, approvals, and alerts tied to your sections.</p>
          </div>
          <Button variant="primary">
            <Bell className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
        </div>

        <Card>
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No notifications available</h2>
            <p className="text-slate-500 text-sm">
              Notifications will appear here when there are updates related to your classes and activities.
            </p>
          </div>
        </Card>
      </div>
    </FacultyLayout>
  )
}

export default FacultyNotifications

