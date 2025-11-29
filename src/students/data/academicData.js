import {
  activeStudentProfile,
  assignmentWorkflows,
  leaveRequestTickets,
  complaintTickets,
  eventProposals as studentProposalPipeline,
  skillProgramCatalogue
} from '../../shared/data/workflowData'

export const notices = [
  { id: 1, title: 'Semester Exam Schedule Released', date: '2025-01-15', type: 'announcement', priority: 'high', description: 'The final examination schedule for Spring 2025 semester has been published. Please check your timetable for exam dates and venues.' },
  { id: 2, title: 'Campus Fest Registration Open', date: '2025-01-14', type: 'event', priority: 'medium', description: 'Annual campus fest registration is now open. Register before January 20th to participate in various events and competitions.' },
  { id: 3, title: 'Library Hours Extended', date: '2025-01-13', type: 'notice', priority: 'low', description: 'Library will remain open until 10 PM during exam preparation period. Extended hours effective from January 15th.' },
  { id: 4, title: 'Hostel Fee Payment Deadline', date: '2025-01-12', type: 'announcement', priority: 'high', description: 'Last date for hostel fee payment is January 25th. Late payment will incur additional charges.' },
  { id: 5, title: 'Sports Day Event', date: '2025-01-11', type: 'event', priority: 'medium', description: 'Annual sports day will be held on February 5th. Students interested in participating should register by January 30th.' }
]

export const weeklyTimetable = [
  { day: 'Monday', classes: [
    { time: '09:00 - 10:00', subject: 'Data Structures', room: 'CSE-201', instructor: 'Prof. Arun' },
    { time: '10:00 - 11:00', subject: 'Web Technologies', room: 'CSE-305', instructor: 'Prof. Ashok' },
    { time: '11:00 - 12:00', subject: 'DBMS', room: 'CSE-204', instructor: 'Prof. Nithya' },
    { time: '01:00 - 02:00', subject: 'Operating Systems', room: 'CSE-310', instructor: 'Prof. Vishnu' },
    { time: '02:00 - 03:00', subject: 'Computer Networks', room: 'CSE-215', instructor: 'Prof. Keerthana' },
    { time: '03:00 - 04:00', subject: 'Software Engineering', room: 'CSE-409', instructor: 'Prof. Megha' }
  ]},

  { day: 'Tuesday', classes: [
    { time: '09:00 - 10:00', subject: 'Operating Systems', room: 'CSE-310', instructor: 'Prof. Vishnu' },
    { time: '10:00 - 11:00', subject: 'Data Structures', room: 'CSE-201', instructor: 'Prof. Arun' },
    { time: '11:00 - 12:00', subject: 'Web Technologies Lab', room: 'Lab-2', instructor: 'Prof. Ashok' },
    { time: '01:00 - 02:00', subject: 'Computer Networks', room: 'CSE-215', instructor: 'Prof. Keerthana' },
    { time: '02:00 - 03:00', subject: 'DBMS', room: 'CSE-204', instructor: 'Prof. Nithya' },
    { time: '03:00 - 04:00', subject: 'Soft Skills Training', room: 'Seminar Hall', instructor: 'Prof. Ajay' }
  ]},

  { day: 'Wednesday', classes: [
    { time: '09:00 - 10:00', subject: 'Data Structures Lab', room: 'Lab-1', instructor: 'Prof. Arun' },
    { time: '10:00 - 11:00', subject: 'Operating Systems', room: 'CSE-310', instructor: 'Prof. Vishnu' },
    { time: '11:00 - 12:00', subject: 'DBMS', room: 'CSE-204', instructor: 'Prof. Nithya' },
    { time: '01:00 - 02:00', subject: 'Computer Networks', room: 'CSE-215', instructor: 'Prof. Keerthana' },
    { time: '02:00 - 03:00', subject: 'Software Engineering', room: 'CSE-409', instructor: 'Prof. Megha' },
    { time: '03:00 - 04:00', subject: 'Mini Project Hour', room: 'CSE-301', instructor: 'Prof. Ashok' }
  ]},

  { day: 'Thursday', classes: [
    { time: '09:00 - 10:00', subject: 'Web Technologies', room: 'CSE-305', instructor: 'Prof. Ashok' },
    { time: '10:00 - 11:00', subject: 'Data Structures', room: 'CSE-201', instructor: 'Prof. Arun' },
    { time: '11:00 - 12:00', subject: 'Computer Networks Lab', room: 'Lab-2', instructor: 'Prof. Keerthana' },
    { time: '01:00 - 02:00', subject: 'Operating Systems', room: 'CSE-310', instructor: 'Prof. Vishnu' },
    { time: '02:00 - 03:00', subject: 'DBMS', room: 'CSE-204', instructor: 'Prof. Nithya' },
    { time: '03:00 - 04:00', subject: 'Aptitude Training', room: 'Seminar Hall', instructor: 'Prof. Ajay' }
  ]},

  { day: 'Friday', classes: [
    { time: '09:00 - 10:00', subject: 'Software Engineering', room: 'CSE-409', instructor: 'Prof. Megha' },
    { time: '10:00 - 11:00', subject: 'Web Technologies', room: 'CSE-305', instructor: 'Prof. Ashok' },
    { time: '11:00 - 12:00', subject: 'DBMS Lab', room: 'Lab-1', instructor: 'Prof. Nithya' },
    { time: '01:00 - 02:00', subject: 'Computer Networks', room: 'CSE-215', instructor: 'Prof. Keerthana' },
    { time: '02:00 - 03:00', subject: 'Operating Systems', room: 'CSE-310', instructor: 'Prof. Vishnu' },
    { time: '03:00 - 04:00', subject: 'Elective: AI Basics', room: 'CSE-506', instructor: 'Prof. Ajay' }
  ]}
]


export const lectures = [
  { id: 1, subject: 'Data Structures', topic: 'Binary Trees and Traversal', instructor: 'Dr. Smith', date: '2025-01-10', type: 'video', duration: '45 min', views: 234 },
  { id: 2, subject: 'Web Development', topic: 'React Hooks and State Management', instructor: 'Prof. Johnson', date: '2025-01-08', type: 'video', duration: '52 min', views: 189 },
  { id: 3, subject: 'Database Systems', topic: 'SQL Queries and Joins', instructor: 'Dr. Williams', date: '2025-01-05', type: 'pdf', duration: '30 pages', views: 312 },
  { id: 4, subject: 'Operating Systems', topic: 'Process Scheduling Algorithms', instructor: 'Dr. Brown', date: '2025-01-03', type: 'video', duration: '38 min', views: 156 },
  { id: 5, subject: 'Web Development', topic: 'Assignment Solutions', instructor: 'Prof. Johnson', date: '2025-01-01', type: 'pdf', duration: '15 pages', views: 278 }
]

export const attendanceData = [
  { subject: 'Data Structures', totalClasses: 30, attended: 26, percentage: 87, status: 'good' },
  { subject: 'Web Development', totalClasses: 28, attended: 25, percentage: 89, status: 'good' },
  { subject: 'Database Systems', totalClasses: 30, attended: 24, percentage: 80, status: 'average' },
  { subject: 'Operating Systems', totalClasses: 25, attended: 22, percentage: 88, status: 'good' },
  { subject: 'Computer Networks', totalClasses: 28, attended: 20, percentage: 71, status: 'warning' }
]

export const overallAttendance = 85

export const gradesData = [
  { subject: 'Data Structures', assignments: [{ name: 'Assignment 1', grade: 'A', maxGrade: 100, obtained: 92 }], quizzes: [{ name: 'Quiz 1', grade: 'B+', maxGrade: 20, obtained: 17 }], exams: [{ name: 'Midterm', grade: 'A-', maxGrade: 100, obtained: 88 }], overall: 'A-' },
  { subject: 'Web Development', assignments: [{ name: 'Project 1', grade: 'A', maxGrade: 100, obtained: 95 }], quizzes: [{ name: 'Quiz 1', grade: 'A', maxGrade: 20, obtained: 19 }], exams: [{ name: 'Midterm', grade: 'B+', maxGrade: 100, obtained: 85 }], overall: 'A' },
  { subject: 'Database Systems', assignments: [{ name: 'Assignment 1', grade: 'B+', maxGrade: 100, obtained: 87 }], quizzes: [{ name: 'Quiz 1', grade: 'B', maxGrade: 20, obtained: 16 }], exams: [{ name: 'Midterm', grade: 'B', maxGrade: 100, obtained: 82 }], overall: 'B+' }
]

export const exams = [
  { id: 1, title: 'Internal Assessment 2', date: '2025-02-05', time: '09:00 AM', room: 'Hall A', subjects: ['Data Structures', 'Operating Systems'] },
  { id: 2, title: 'Model Exam', date: '2025-02-15', time: '10:00 AM', room: 'Main Block', subjects: ['Web Development', 'Database Systems'] },
  { id: 3, title: 'Lab Exam', date: '2025-02-25', time: '01:00 PM', room: 'Lab 5', subjects: ['Web Development Lab'] }
]

export const events = [
  { id: 1, title: 'Tech Fest 2025', date: '2025-02-10', time: '09:00 AM', location: 'Main Auditorium', type: 'festival', description: 'Annual technical festival with coding competitions, workshops, and tech talks.' },
  { id: 2, title: 'Career Fair', date: '2025-02-15', time: '10:00 AM', location: 'Sports Complex', type: 'career', description: 'Meet top companies and explore internship and job opportunities.' },
  { id: 3, title: 'Guest Lecture: AI & ML', date: '2025-01-25', time: '02:00 PM', location: 'Hall A', type: 'lecture', description: 'Guest lecture by industry expert on Artificial Intelligence and Machine Learning.' }
]

export const communications = [
  { id: 1, sender: 'Dr. Smith', role: 'Class Mentor', message: 'Please submit your assignment draft by Friday for review.', time: '2 hours ago' },
  { id: 2, sender: 'Prof. Johnson', role: 'Web Development Faculty', message: 'Additional reference materials have been uploaded for the next lab session.', time: '5 hours ago' },
  { id: 3, sender: 'Class Group', role: 'CS-B', message: 'Reminder: Project stand-up meeting tomorrow at 8:30 AM.', time: '1 day ago' }
]

const { id: activeStudentId, section: activeStudentSection } = activeStudentProfile

export const assignments = assignmentWorkflows
  .filter(assignment => assignment.sections.includes(activeStudentSection))
  .map((assignment) => {
    const mySubmission = assignment.submissions.find(sub => sub.studentId === activeStudentId)
    return {
      ...assignment,
      status: mySubmission ? 'submitted' : 'pending',
      submissionMeta: mySubmission || null
    }
  })

export const leaveRequests = leaveRequestTickets
  .filter(ticket => ticket.studentId === activeStudentId)
  .map(ticket => ({
    id: ticket.id,
    startDate: ticket.startDate,
    endDate: ticket.endDate,
    reason: ticket.reason,
    status: ticket.status,
    submittedDate: ticket.submittedAt,
    advisor: ticket.advisor,
    documents: ticket.documents
  }))

export const complaints = complaintTickets
  .filter(ticket => ticket.studentId === activeStudentId)
  .map(ticket => ({
    id: ticket.id,
    title: ticket.title,
    category: ticket.category,
    description: ticket.text,
    status: ticket.status,
    submittedDate: ticket.submittedAt,
    priority: ticket.priority,
    assignedFaculty: ticket.assignedFaculty,
    forwardedToAdmin: ticket.forwardedToAdmin
  }))

export const studentEventProposals = studentProposalPipeline
  .filter(proposal => proposal.studentId === activeStudentId)

export const skillPrograms = skillProgramCatalogue
  .filter(program => program.sections.includes(activeStudentSection))

export const studentProfile = activeStudentProfile

