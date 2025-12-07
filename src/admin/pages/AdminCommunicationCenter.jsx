import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { MessageSquare, Send, Inbox, Mail, Clock, User } from 'lucide-react'
import { getAllClassesAPI, getClassStudentsAPI } from '../../services/classAPI'
import { getAllUsersAPI } from '../../services/api'
import { sendMessageAPI, getInboxAPI, getSentAPI } from '../../services/communicationAPI'

const broadcastTargets = [
  { value: 'all-students', label: 'All Students' },
  { value: 'all-faculty', label: 'All Faculty' },
  { value: 'all-hr', label: 'All HR' },
  { value: 'specific-class', label: 'Specific Class' }
]

const directMessageRoles = [
  { value: 'student', label: 'Student' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'hr', label: 'HR' }
]

const AdminCommunicationCenter = () => {
  const [activeTab, setActiveTab] = useState('inbox')
  const [classes, setClasses] = useState([])
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [students, setStudents] = useState([])
  const [inbox, setInbox] = useState([])
  const [sent, setSent] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  
  const [broadcast, setBroadcast] = useState({ 
    audience: 'all-students', 
    classId: '',
    subject: '',
    message: '' 
  })
  
  const [directMessage, setDirectMessage] = useState({ 
    role: '',
    classId: '',
    studentId: '',
    subject: '',
    message: '' 
  })

  useEffect(() => {
    loadClasses()
    loadUsers()
    loadMessages()
  }, [])

  useEffect(() => {
    if (activeTab === 'inbox') {
      loadInbox()
    } else if (activeTab === 'sent') {
      loadSent()
    }
  }, [activeTab])

  useEffect(() => {
    if (directMessage.role === 'student' && directMessage.classId) {
      loadStudentsForClass(directMessage.classId)
    } else {
      setStudents([])
    }
  }, [directMessage.classId, directMessage.role])

  const loadClasses = async () => {
    try {
      setLoadingClasses(true)
      const res = await getAllClassesAPI()
      if (res?.status === 200) {
        setClasses(res.data.classes || [])
      }
    } catch (error) {
      console.error('Error loading classes:', error)
    } finally {
      setLoadingClasses(false)
    }
  }

  const loadUsers = async () => {
    try {
      const res = await getAllUsersAPI()
      if (res?.status === 200) {
        setAllUsers(res.data.users || [])
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadStudentsForClass = async (classId) => {
    try {
      const res = await getClassStudentsAPI(classId)
      if (res?.status === 200) {
        setStudents(res.data.students || [])
      }
    } catch (error) {
      console.error('Error loading students:', error)
      setStudents([])
    }
  }

  const loadMessages = () => {
    loadInbox()
    loadSent()
  }

  const loadInbox = async () => {
    try {
      setLoadingMessages(true)
      const res = await getInboxAPI()
      if (res?.status === 200) {
        setInbox(res.data.messages || [])
      } else {
        toast.error('Failed to load inbox')
      }
    } catch (error) {
      console.error('Error loading inbox:', error)
      toast.error('Failed to load inbox')
    } finally {
      setLoadingMessages(false)
    }
  }

  const loadSent = async () => {
    try {
      setLoadingMessages(true)
      const res = await getSentAPI()
      if (res?.status === 200) {
        setSent(res.data.messages || [])
      } else {
        toast.error('Failed to load sent messages')
      }
    } catch (error) {
      console.error('Error loading sent messages:', error)
      toast.error('Failed to load sent messages')
    } finally {
      setLoadingMessages(false)
    }
  }

  const sendBroadcast = async (e) => {
    e.preventDefault()
    if (!broadcast.message.trim()) return toast.error('Enter a broadcast message')
    if (!broadcast.subject.trim()) return toast.error('Enter a subject')
    
    try {
      let payload = {
        subject: broadcast.subject,
        body: broadcast.message,
      }

      if (broadcast.audience === 'specific-class') {
        if (!broadcast.classId) {
          return toast.error('Please select a class')
        }
        payload.mode = 'class'
        payload.targetClassId = broadcast.classId
      } else {
        payload.mode = 'role'
        const roleMap = {
          'all-students': 'student',
          'all-faculty': 'faculty',
          'all-hr': 'hr'
        }
        payload.targetRole = roleMap[broadcast.audience]
      }

      const res = await sendMessageAPI(payload)
      if (res?.status === 201) {
        toast.success('Broadcast sent successfully')
        setBroadcast({ audience: 'all-students', classId: '', subject: '', message: '' })
        loadSent()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to send broadcast')
      }
    } catch (error) {
      console.error('Error sending broadcast:', error)
      toast.error(error?.response?.data?.message || 'Failed to send broadcast')
    }
  }

  const sendDirectMessage = async (e) => {
    e.preventDefault()
    if (!directMessage.role) return toast.error('Please select a role')
    if (!directMessage.message.trim()) return toast.error('Enter a message')
    if (!directMessage.subject.trim()) return toast.error('Enter a subject')
    
    try {
      let payload = {
        subject: directMessage.subject,
        body: directMessage.message,
        mode: 'user',
      }

      if (directMessage.role === 'student') {
        if (!directMessage.classId) return toast.error('Please select a class')
        if (!directMessage.studentId) return toast.error('Please select a student')
        payload.targetUserId = directMessage.studentId
      } else {
        // For faculty or HR, need to select a user
        if (!directMessage.studentId) {
          return toast.error('Please select a user')
        }
        payload.targetUserId = directMessage.studentId
      }

      const res = await sendMessageAPI(payload)
      if (res?.status === 201) {
        toast.success('Direct message sent successfully')
        setDirectMessage({ role: '', classId: '', studentId: '', subject: '', message: '' })
        loadSent()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending direct message:', error)
      toast.error(error?.response?.data?.message || 'Failed to send message')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-900 text-white p-6 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Communication Center</p>
              <h1 className="text-3xl font-bold mt-1">Broadcast & Direct Messages</h1>
            </div>
          </div>
          <p className="text-slate-300 mt-3">Send broadcasts to groups or direct messages to specific users.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Message Composer */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="border border-slate-100 bg-white/80 backdrop-blur">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Broadcast Message</h2>
              <form onSubmit={sendBroadcast} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Audience</label>
                  <select
                    value={broadcast.audience}
                    onChange={(e) => setBroadcast({ ...broadcast, audience: e.target.value, classId: '' })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  >
                    {broadcastTargets.map(target => (
                      <option key={target.value} value={target.value}>{target.label}</option>
                    ))}
                  </select>
                </div>
                
                {broadcast.audience === 'specific-class' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Class</label>
                    <select
                      value={broadcast.classId}
                      onChange={(e) => setBroadcast({ ...broadcast, classId: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      disabled={loadingClasses}
                    >
                      <option value="">Select a class</option>
                      {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>{cls.className}</option>
                      ))}
                    </select>
                  </div>
                )}

                <FormInput
                  label="Subject"
                  placeholder="e.g., Mid-term timetable release"
                  value={broadcast.subject}
                  onChange={(e) => setBroadcast({ ...broadcast, subject: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    value={broadcast.message}
                    onChange={(e) => setBroadcast({ ...broadcast, message: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Write your broadcast message..."
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 border-none">
                  <Send className="w-4 h-4 mr-2" />
                  Send Broadcast
                </Button>
              </form>
            </Card>

            <Card className="border border-slate-100 bg-white/80 backdrop-blur">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Direct Message</h2>
              <form onSubmit={sendDirectMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Role</label>
                  <select
                    value={directMessage.role}
                    onChange={(e) => setDirectMessage({ ...directMessage, role: e.target.value, classId: '', studentId: '' })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  >
                    <option value="">Select role</option>
                    {directMessageRoles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                {directMessage.role === 'student' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Class</label>
                      <select
                        value={directMessage.classId}
                        onChange={(e) => setDirectMessage({ ...directMessage, classId: e.target.value, studentId: '' })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                        disabled={loadingClasses}
                      >
                        <option value="">Select a class</option>
                        {classes.map(cls => (
                          <option key={cls._id} value={cls._id}>{cls.className}</option>
                        ))}
                      </select>
                    </div>
                    {directMessage.classId && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Student</label>
                        <select
                          value={directMessage.studentId}
                          onChange={(e) => setDirectMessage({ ...directMessage, studentId: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                        >
                          <option value="">Select a student</option>
                          {students.map(student => (
                            <option key={student._id} value={student._id}>{student.name} ({student.studentID})</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}

                {(directMessage.role === 'faculty' || directMessage.role === 'hr') && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Select {directMessage.role === 'faculty' ? 'Faculty' : 'HR'}
                    </label>
                    <select
                      value={directMessage.studentId}
                      onChange={(e) => setDirectMessage({ ...directMessage, studentId: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    >
                      <option value="">Select a {directMessage.role}</option>
                      {allUsers
                        .filter(user => user.role === directMessage.role)
                        .map(user => (
                          <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                        ))}
                    </select>
                  </div>
                )}

                <FormInput
                  label="Subject"
                  placeholder="Message subject"
                  value={directMessage.subject}
                  onChange={(e) => setDirectMessage({ ...directMessage, subject: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    value={directMessage.message}
                    onChange={(e) => setDirectMessage({ ...directMessage, message: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Write your message..."
                  />
                </div>
                <Button type="submit" variant="secondary" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Right: Message Lists */}
          <div className="xl:col-span-2">
            <Card className="border border-slate-100 bg-white/80 backdrop-blur">
              <div className="flex items-center gap-4 mb-6 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
                    activeTab === 'inbox'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  Inbox
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
                    activeTab === 'sent'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Sent
                </button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {activeTab === 'inbox' ? (
                  inbox.length > 0 ? (
                    inbox.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{message.from}</p>
                              <p className="text-xs text-slate-500">{message.role}</p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {message.subject && (
                          <p className="text-sm font-medium text-slate-900 mb-1">{message.subject}</p>
                        )}
                        <p className="text-sm text-slate-600 line-clamp-2">{message.preview || message.message}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No messages in inbox</p>
                    </div>
                  )
                ) : (
                  sent.length > 0 ? (
                    sent.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">To: {message.to}</p>
                            <p className="text-xs text-slate-500">{message.audience || message.role}</p>
                          </div>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {message.subject && (
                          <p className="text-sm font-medium text-slate-900 mb-1">{message.subject}</p>
                        )}
                        <p className="text-sm text-slate-600 line-clamp-2">{message.preview || message.message}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No sent messages</p>
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminCommunicationCenter

