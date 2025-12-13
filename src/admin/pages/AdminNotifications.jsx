import { motion } from 'framer-motion'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Bell } from 'lucide-react'

// Admin activity feed will be integrated with backend later
const AdminNotifications = () => {

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Notifications</p>
            <h1 className="text-3xl font-bold text-slate-900">System activity & alerts</h1>
            <p className="text-slate-600">Stay updated with all campus activities and important notifications</p>
          </div>
          <Button variant="secondary">
            <Bell className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
        </div>

        <Card>
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No recent admin activity</h2>
            <p className="text-slate-500 text-sm">
              System activities and notifications will appear here when available.
            </p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default AdminNotifications

