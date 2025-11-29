import { motion } from 'framer-motion'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Bell, Users, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { recentActivities } from '../data/adminDemoData'

const AdminNotifications = () => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return Users
      case 'approval': return Calendar
      case 'event': return CheckCircle2
      default: return Bell
    }
  }

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">User Activities</p>
                <p className="text-2xl font-bold text-slate-900">
                  {recentActivities.filter(a => a.type === 'user').length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Approval Requests</p>
                <p className="text-2xl font-bold text-slate-900">
                  {recentActivities.filter(a => a.type === 'approval').length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Event Updates</p>
                <p className="text-2xl font-bold text-slate-900">
                  {recentActivities.filter(a => a.type === 'event').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => {
              const Icon = getActivityIcon(activity.type)
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-1">{activity.title}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default AdminNotifications

