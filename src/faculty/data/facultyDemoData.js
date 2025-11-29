import { MessageSquare, CheckCircle2, Bell, AlertCircle } from 'lucide-react'

export const facultyProfiles = [
  {
    id: 'FAC-201',
    name: 'Dr. Ananya',
    email: 'ananya.rao@smartcampus.edu',
    department: 'Computer Science',
    credentials: {
      username: 'fac_ds',
      password: 'ds@123'
    },
    subject: {
      name: 'Data Structures',
      code: 'CS201',
      type: 'Theory + Lab',
      semesters: ['Sem 4', 'Sem 5']
    },
    stats: {
      sections: 3,
      students: 138,
      pendingGrading: 5,
      attendance: 93,
      labs: 2,
      announcements: 1
    },
    sections: [
      {
        name: 'CSE-2A',
        students: 46,
        schedule: 'Mon & Wed · 09:00 AM',
        room: 'A-201',
        classesThisWeek: 3,
        attendance: 95,
        focus: 'Module 4 · Trees'
      },
      {
        name: 'CSE-2B',
        students: 44,
        schedule: 'Tue & Thu · 11:00 AM',
        room: 'B-104',
        classesThisWeek: 4,
        attendance: 91,
        focus: 'Module 3 · Stacks'
      },
      {
        name: 'CSE-2C',
        students: 48,
        schedule: 'Fri · 02:00 PM',
        room: 'Lab-3',
        classesThisWeek: 2,
        attendance: 89,
        focus: 'Lab · Linked Lists'
      }
    ],
    todaysSessions: [
      { time: '09:00 AM', section: 'CSE-2A', room: 'A-201', format: 'Theory', students: 46 },
      { time: '02:00 PM', section: 'CSE-2C', room: 'Lab-3', format: 'Lab', students: 48 }
    ],
    tasks: [
      { title: 'Grade Lab · Linked Lists', context: 'CSE-2C', dueDate: 'Today', priority: 'high' },
      { title: 'Upload module quiz', context: 'CSE-2B', dueDate: 'Tomorrow', priority: 'medium' },
      { title: 'Prepare tutorial deck', context: 'CSE-2A', dueDate: 'Friday', priority: 'medium' }
    ],
    activities: [
      { title: 'Shared revision material with CSE-2B', time: '45 mins ago', icon: MessageSquare },
      { title: 'Updated quiz scores for CSE-2A', time: '3 hours ago', icon: CheckCircle2 },
      { title: 'Posted lab guidelines for CSE-2C', time: 'Yesterday', icon: Bell }
    ]
  },
  {
    id: 'FAC-305',
    name: 'Prof. Siddharth',
    email: 'siddharth.mehta@smartcampus.edu',
    department: 'Electronics',
    credentials: {
      username: 'fac_ss',
      password: 'signals@123'
    },
    subject: {
      name: 'Signals & Systems',
      code: 'EC302',
      type: 'Theory',
      semesters: ['Sem 5']
    },
    stats: {
      sections: 2,
      students: 92,
      pendingGrading: 3,
      attendance: 88,
      labs: 0,
      announcements: 2
    },
    sections: [
      {
        name: 'ECE-3A',
        students: 47,
        schedule: 'Mon & Thu · 10:00 AM',
        room: 'E-401',
        classesThisWeek: 3,
        attendance: 90,
        focus: 'Frequency response'
      },
      {
        name: 'ECE-3B',
        students: 45,
        schedule: 'Wed & Fri · 12:00 PM',
        room: 'E-305',
        classesThisWeek: 2,
        attendance: 86,
        focus: 'Convolution practice'
      }
    ],
    todaysSessions: [
      { time: '10:00 AM', section: 'ECE-3A', room: 'E-401', format: 'Theory', students: 47 }
    ],
    tasks: [
      { title: 'Review mid-term solution keys', context: 'ECE-3B', dueDate: 'Today', priority: 'high' },
      { title: 'Schedule consultation slots', context: 'All Sections', dueDate: 'Tomorrow', priority: 'medium' }
    ],
    activities: [
      { title: 'Posted announcement: Guest lecture', time: '2 hours ago', icon: Bell },
      { title: 'Approved leave for ECE-3A student', time: '5 hours ago', icon: AlertCircle }
    ]
  }
]

export const academicBlueprints = [
  {
    title: 'Module 4 · Advanced Trees',
    status: 'In Progress',
    sections: ['CSE-2A', 'CSE-2B'],
    deadline: 'Fri, 22 Nov',
    deliverables: ['Lecture slides', 'Quiz draft', 'Lab handout']
  },
  {
    title: 'Revision Sprint · Signals',
    status: 'Scheduled',
    sections: ['ECE-3A'],
    deadline: 'Mon, 25 Nov',
    deliverables: ['Question bank', 'Practice set']
  }
]

export const gradingQueues = [
  {
    title: 'Lab 05 · Linked Lists',
    section: 'CSE-2C',
    submissions: 48,
    pending: 12,
    due: 'Today · 5:00 PM'
  },
  {
    title: 'Quiz 03 · Frequency Response',
    section: 'ECE-3A',
    submissions: 47,
    pending: 5,
    due: 'Tomorrow · 11:00 AM'
  }
]

export const attendanceSnapshots = [
  {
    date: 'Today',
    sections: [
      { name: 'CSE-2A', present: 42, total: 46, recordedAt: '09:50 AM' },
      { name: 'CSE-2C', present: 44, total: 48, recordedAt: '02:55 PM' }
    ]
  },
  {
    date: 'Yesterday',
    sections: [
      { name: 'CSE-2B', present: 40, total: 44, recordedAt: '11:55 AM' },
      { name: 'ECE-3A', present: 45, total: 47, recordedAt: '10:55 AM' }
    ]
  }
]

export const communicationThreads = [
  {
    id: 'thread-1',
    title: 'Exam Preparation Broadcast',
    audience: 'CSE-2A · 46 students',
    lastMessage: 'Remember to review AVL tree rotations.',
    lastActivity: '12 mins ago',
    unread: 3
  },
  {
    id: 'thread-2',
    title: 'Signals Lab Support',
    audience: 'ECE-3B · 45 students',
    lastMessage: 'Lab timing shifted to 2 PM tomorrow.',
    lastActivity: '1 hour ago',
    unread: 0
  }
]

