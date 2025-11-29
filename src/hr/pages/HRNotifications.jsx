import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import { Bell, AlertTriangle } from 'lucide-react'

const notifications = [
  { title: 'Interview feedback pending', detail: 'Panel feedback for JOB-210 (Aditi) is due today.', time: '10 mins ago', type: 'alert' },
  { title: 'Assessment window closed', detail: 'TEST-101 submissions synced to applications.', time: '1 hour ago', type: 'info' },
  { title: 'Company documents uploaded', detail: 'PixelCraft onboarding pack added by admin.', time: 'Yesterday', type: 'info' }
]

const HRNotifications = () => (
  <HRLayout>
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-500">Notifications</p>
        <h1 className="text-3xl font-bold text-slate-900">Latest HR alerts</h1>
        <p className="text-slate-600">Keep track of admin actions, interview reminders, and student updates.</p>
      </div>

      <Card>
        <div className="space-y-4">
          {notifications.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                item.type === 'alert' ? 'bg-rose-50 text-rose-600' : 'bg-purple-50 text-purple-600'
              }`}>
                {item.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-600">{item.detail}</p>
                <p className="text-xs text-slate-400 mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </HRLayout>
)

export default HRNotifications

