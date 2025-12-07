import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { MessageSquare, Send, Inbox, Mail, Clock, User } from 'lucide-react'
import { getActiveFacultyProfile } from '../utils/getActiveFaculty'

const CommunicationHub = () => {
  const selectedFaculty = useMemo(() => getActiveFacultyProfile(), [])
  const [activeTab, setActiveTab] = useState('inbox')
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [inbox, setInbox] = useState([])
  const [sent, setSent] = useState([])
  
  const [message, setMessage] = useState({
    recipientType: 'class', // 'class', 'student', 'admin'
    classId: '',
    studentId: '',
    recipientTypeOption: 'all', // 'all' for entire class, 'one' for one student
    subject: '',
    message: ''
  })

  useEffect(() => {
    // Load assigned classes for faculty
    // TODO: Fetch from API based on selectedFaculty
    if (selectedFaculty?.sections) {
      setClasses(selectedFaculty.sections.map(section => ({
        _id: section.name,
        className: section.name,
        students: section.students || 0
      })))
    }
  }, [selectedFaculty])

  useEffect(() => {
    if (message.recipientType === 'class' && message.classId && message.recipientTypeOption === 'one') {
      loadStudentsForClass(message.classId)
    } else {
      setStudents([])
    }
  }, [message.classId, message.recipientTypeOption, message.recipientType])

  const loadStudentsForClass = async (classId) => {
    try {
      // TODO: Implement API call to fetch students for a class
      setStudents([])
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.message.trim()) {
      toast.error('Please enter a message')
      return
    }
    
    if (message.recipientType === 'class') {
      if (!message.classId) {
        toast.error('Please select a class')
        return
      }
      if (message.recipientTypeOption === 'one' && !message.studentId) {
        toast.error('Please select a student')
        return
      }
    }

    // TODO: Call API POST /messages/send
    toast.success('Message sent')
    setMessage({
      recipientType: 'class',
      classId: '',
      studentId: '',
      recipientTypeOption: 'all',
      subject: '',
      message: ''
    })
  }

  return (
    <FacultyLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Communication</p>
            <h1 className="text-3xl font-bold text-slate-900">Send Messages</h1>
            <p className="text-slate-600">Message your classes, individual students, or contact admin.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Message Composer */}
          <div className="xl:col-span-1">
            <Card className="border border-slate-100 bg-white/80 backdrop-blur">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Send Message</h2>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Recipient</label>
                  <select
                    value={message.recipientType}
                    onChange={(e) => setMessage({ ...message, recipientType: e.target.value, classId: '', studentId: '' })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  >
                    <option value="class">My Classes</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {message.recipientType === 'class' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Class</label>
                      <select
                        value={message.classId}
                        onChange={(e) => setMessage({ ...message, classId: e.target.value, studentId: '' })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      >
                        <option value="">Select a class</option>
                        {classes.map(cls => (
                          <option key={cls._id} value={cls._id}>{cls.className}</option>
                        ))}
                      </select>
                    </div>

                    {message.classId && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="all"
                              checked={message.recipientTypeOption === 'all'}
                              onChange={(e) => setMessage({ ...message, recipientTypeOption: e.target.value, studentId: '' })}
                              className="text-blue-600"
                            />
                            <span className="text-sm text-slate-700">Entire class</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="one"
                              checked={message.recipientTypeOption === 'one'}
                              onChange={(e) => setMessage({ ...message, recipientTypeOption: e.target.value })}
                              className="text-blue-600"
                            />
                            <span className="text-sm text-slate-700">One student</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {message.classId && message.recipientTypeOption === 'one' && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Student</label>
                        <select
                          value={message.studentId}
                          onChange={(e) => setMessage({ ...message, studentId: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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

                <FormInput
                  label="Subject"
                  placeholder="Message subject"
                  value={message.subject}
                  onChange={(e) => setMessage({ ...message, subject: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    value={message.message}
                    onChange={(e) => setMessage({ ...message, message: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Write your message..."
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full">
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
                      ? 'text-blue-600 border-b-2 border-blue-600'
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
                      ? 'text-blue-600 border-b-2 border-blue-600'
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
                    inbox.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{msg.from}</p>
                              <p className="text-xs text-slate-500">{msg.role}</p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {msg.timestamp}
                          </span>
                        </div>
                        {msg.subject && (
                          <p className="text-sm font-medium text-slate-900 mb-1">{msg.subject}</p>
                        )}
                        <p className="text-sm text-slate-600 line-clamp-2">{msg.preview || msg.message}</p>
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
                    sent.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">To: {msg.to}</p>
                            <p className="text-xs text-slate-500">{msg.audience || msg.className}</p>
                          </div>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {msg.timestamp}
                          </span>
                        </div>
                        {msg.subject && (
                          <p className="text-sm font-medium text-slate-900 mb-1">{msg.subject}</p>
                        )}
                        <p className="text-sm text-slate-600 line-clamp-2">{msg.preview || msg.message}</p>
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
    </FacultyLayout>
  )
}

export default CommunicationHub

