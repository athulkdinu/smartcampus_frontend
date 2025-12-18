import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Building2, Calendar, Clock, MapPin, CheckCircle2, XCircle, BookOpen } from 'lucide-react'

const AdminCampusManagement = () => {
  const [bookings, setBookings] = useState([])

  const handleApproveBooking = (id) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: 'Approved' } : booking
    ))
    toast.success('Resource booking approved')
  }

  const handleRejectBooking = (id) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: 'Rejected' } : booking
    ))
    toast.error('Resource booking rejected')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-green-700'
      case 'Pending': return 'bg-amber-50 text-amber-700'
      case 'Rejected': return 'bg-rose-50 text-rose-700'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  const pendingBookings = bookings.filter(b => b.status === 'Pending').length
  const approvedBookings = bookings.filter(b => b.status === 'Approved').length

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Campus Resource Management</p>
            <h1 className="text-3xl font-bold text-slate-900">Manage campus resources & bookings</h1>
            <p className="text-slate-600">Oversee classroom, lab, and facility allocations</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-900">{bookings.length}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              {approvedBookings} approved bookings
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending Approvals</p>
                <p className="text-2xl font-bold text-slate-900">{pendingBookings}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">Requires admin action</p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Available Resources</p>
                <p className="text-2xl font-bold text-slate-900">12</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">Classrooms, labs, halls</p>
          </Card>
        </div>

        {/* Resource Bookings Table */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Resource Booking Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Resource</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Requester</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Purpose</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, idx) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">{booking.resource}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{booking.type}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{booking.requester}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{booking.time}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{booking.purpose}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {booking.status === 'Pending' && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApproveBooking(booking.id)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRejectBooking(booking.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No resource bookings found</p>
              </div>
            )}
          </div>
        </Card>

        {/* Academic Calendar Section */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Academic Calendar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Semester Start', date: '2024-08-01', type: 'Academic' },
              { title: 'Midterm Exams', date: '2024-10-15', type: 'Examination' },
              { title: 'Semester End', date: '2024-12-20', type: 'Academic' },
              { title: 'Final Exams', date: '2024-12-25', type: 'Examination' }
            ].map((entry, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{entry.title}</h3>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg">
                    {entry.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{entry.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </AdminLayout>
  )
}

export default AdminCampusManagement

