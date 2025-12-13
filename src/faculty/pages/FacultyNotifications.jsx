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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent events</h2>
            <div className="space-y-4">
              {timeline.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-2xl border border-slate-200 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card>
              <div className="flex items-center gap-3">
                <CalendarCheck2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-500">Upcoming</p>
                  <p className="text-lg font-semibold text-slate-900">2 calendar events</p>
                  <p className="text-xs text-slate-500">Exam board review · Project demo</p>
                </div>
              </div>
            </Card>
            <Card className="bg-rose-50 border-rose-100">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <div>
                  <p className="text-sm font-semibold text-rose-700">Action required</p>
                  <p className="text-sm text-rose-600">2 leave requests waiting for faculty recommendation.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </FacultyLayout>
  )
}

export default FacultyNotifications

