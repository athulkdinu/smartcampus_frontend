import { motion } from 'framer-motion'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { HelpCircle, MessageCircle, FileText, Mail, Phone } from 'lucide-react'

const HelpPage = () => {
  const faqs = [
    { question: 'How do I submit an assignment?', answer: 'Navigate to Academic & Campus > Assignments Board, select your assignment, and upload your file.' },
    { question: 'How can I check my attendance?', answer: 'Go to Academic & Campus > Attendance Insights to view your attendance records.' },
    { question: 'Where do I find my grades?', answer: 'Your grades are available in Academic & Campus > Academic Grades section.' },
    { question: 'How do I apply for leave?', answer: 'Visit Academic & Campus > Leave Portal to submit a leave request with required documents.' }
  ]

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Help & Support</h1>
          <p className="text-slate-600">Find answers to common questions or contact our support team</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'FAQs', icon: HelpCircle, color: 'from-blue-500 to-blue-600' },
            { label: 'Live Chat', icon: MessageCircle, color: 'from-green-500 to-green-600' },
            { label: 'Documentation', icon: FileText, color: 'from-purple-500 to-purple-600' },
            { label: 'Contact Us', icon: Mail, color: 'from-orange-500 to-orange-600' }
          ].map((action, idx) => {
            const Icon = action.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="cursor-pointer text-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{action.label}</h3>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* FAQs */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50"
              >
                <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-slate-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Contact Support */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-slate-100 bg-slate-50">
              <Mail className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Email Support</h3>
              <p className="text-sm text-slate-600 mb-4">Send us an email and we'll respond within 24 hours</p>
              <Button variant="secondary" size="sm">support@smartcampus.edu</Button>
            </div>
            <div className="p-6 rounded-xl border border-slate-100 bg-slate-50">
              <Phone className="w-6 h-6 text-green-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Phone Support</h3>
              <p className="text-sm text-slate-600 mb-4">Call us during business hours (9 AM - 5 PM)</p>
              <Button variant="secondary" size="sm">+1 (555) 123-4567</Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default HelpPage

