export const userAccounts = [
  {
    id: 'STU-1001',
    name: 'Aditi ',
    email: 'aditi@student.smartcampus.edu',
    role: 'student',
    branch: 'CSE',
    year: '3rd Year',
    status: 'Active',
    createdAt: '2023-08-15',
    lastLogin: '2 hours ago'
  },
  {
    id: 'STU-1002',
    name: 'Rahul Iyer',
    email: 'rahul@student.smartcampus.edu',
    role: 'student',
    branch: 'IT',
    year: '2nd Year',
    status: 'Active',
    createdAt: '2023-08-20',
    lastLogin: '5 hours ago'
  },
  {
    id: 'FAC-201',
    name: 'Dr. Ananya',
    email: 'ananya@smartcampus.edu',
    role: 'faculty',
    department: 'Computer Science',
    subject: 'Data Structures',
    status: 'Active',
    createdAt: '2022-01-10',
    lastLogin: '1 hour ago'
  },
  {
    id: 'FAC-305',
    name: 'Prof. Siddharth',
    email: 'siddharth@smartcampus.edu',
    role: 'faculty',
    department: 'Electronics',
    subject: 'Signals & Systems',
    status: 'Active',
    createdAt: '2022-02-15',
    lastLogin: '3 hours ago'
  },
  {
    id: 'HR-501',
    name: 'NextWave Labs HR',
    email: 'hr@nextwavelabs.com',
    role: 'hr',
    company: 'NextWave Labs',
    status: 'Active',
    createdAt: '2024-01-05',
    lastLogin: '30 mins ago'
  },
  {
    id: 'HR-502',
    name: 'Insight Analytics HR',
    email: 'recruitment@insightanalytics.com',
    role: 'hr',
    company: 'Insight Analytics',
    status: 'Active',
    createdAt: '2024-02-10',
    lastLogin: '1 day ago'
  }
]

export const pendingApprovals = []

export const resourceBookings = [
  {
    id: 'RB-001',
    resource: 'Seminar Hall A',
    type: 'Seminar Hall',
    requester: 'CS Department',
    requesterEmail: 'cs.dept@smartcampus.edu',
    date: '2024-12-10',
    time: '2:00 PM - 4:00 PM',
    purpose: 'Guest Lecture',
    status: 'Pending',
    requestedAt: '2024-11-20'
  },
  {
    id: 'RB-002',
    resource: 'AI/ML Lab',
    type: 'Laboratory',
    requester: 'IT Department',
    requesterEmail: 'it.dept@smartcampus.edu',
    date: '2024-11-28',
    time: '9:00 AM - 1:00 PM',
    purpose: 'Workshop',
    status: 'Pending',
    requestedAt: '2024-11-22'
  },
  {
    id: 'RB-003',
    resource: 'Main Auditorium',
    type: 'Auditorium',
    requester: 'Placement Cell',
    requesterEmail: 'placement@smartcampus.edu',
    date: '2024-12-15',
    time: '10:00 AM - 5:00 PM',
    purpose: 'Career Fair',
    status: 'Approved',
    requestedAt: '2024-11-15'
  },
  {
    id: 'RB-004',
    resource: 'Lab Complex - Room 3',
    type: 'Laboratory',
    requester: 'ECE Department',
    requesterEmail: 'ece.dept@smartcampus.edu',
    date: '2024-11-25',
    time: '3:00 PM - 5:00 PM',
    purpose: 'Project Demo',
    status: 'Approved',
    requestedAt: '2024-11-18'
  }
]

export const userApprovalRequests = [
  {
    id: 'UAR-001',
    name: 'Dr. Priya Menon',
    email: 'priya.menon@smartcampus.edu',
    role: 'faculty',
    department: 'Computer Science',
    subject: 'Database Systems',
    requestedAt: '2024-11-21',
    status: 'Pending'
  },
  {
    id: 'UAR-002',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@student.smartcampus.edu',
    role: 'student',
    branch: 'CSE',
    year: '2nd Year',
    requestedAt: '2024-11-20',
    status: 'Pending'
  }
]

export const campusEvents = [
  {
    id: 'EVT-101',
    title: 'Tech Fest 2025',
    type: 'Festival',
    status: 'Pending Approval',
    organizer: 'HR Department',
    startDate: '2025-03-15',
    endDate: '2025-03-17',
    venue: 'Main Auditorium',
    expectedAttendees: 2000,
    budget: '₹5,00,000'
  },
  {
    id: 'EVT-102',
    title: 'Industry Expert Talk: AI in Healthcare',
    type: 'Seminar',
    status: 'Approved',
    organizer: 'CS Department',
    startDate: '2024-12-05',
    endDate: '2024-12-05',
    venue: 'Seminar Hall A',
    expectedAttendees: 150,
    budget: '₹25,000'
  },
  {
    id: 'EVT-103',
    title: 'Hackathon 2024',
    type: 'Competition',
    status: 'Active',
    organizer: 'IT Department',
    startDate: '2024-11-25',
    endDate: '2024-11-26',
    venue: 'Lab Complex',
    expectedAttendees: 300,
    budget: '₹1,50,000'
  },
  {
    id: 'EVT-104',
    title: 'Career Fair 2024',
    type: 'Fair',
    status: 'Completed',
    organizer: 'Placement Cell',
    startDate: '2024-10-20',
    endDate: '2024-10-20',
    venue: 'Sports Complex',
    expectedAttendees: 1500,
    budget: '₹3,00,000'
  }
]

export const recentActivities = [
  { title: 'Student account created – athul', time: '5 min ago', type: 'user' },
  { title: 'Event approved – TechFest 2025', time: '35 min ago', type: 'event' },
  { title: 'Complaint escalated – Lab Issue', time: '1 hour ago', type: 'complaint' },
  { title: 'HR added – TCS Recruiter', time: '3 hours ago', type: 'user' },
  { title: 'Faculty broadcast acknowledged', time: '5 hours ago', type: 'communication' }
]

export const adminMessageCenter = {
  inbox: [
    {
      id: 'MSG-101',
      from: 'Dr. Ananya',
      role: 'Faculty',
      message: 'Forwarded AI Hack Night proposal for venue clearance.',
      time: '12 mins ago'
    },
    {
      id: 'MSG-102',
      from: 'Aditi ',
      role: 'Student Rep · CSE-2A',
      message: 'Shared feedback on mentorship sessions.',
      time: '1 hour ago'
    },
    {
      id: 'MSG-103',
      from: 'Placement Cell',
      role: 'Department',
      message: 'Need permission to host recruiters in Innovation Lab.',
      time: 'Yesterday'
    }
  ],
  history: [
    {
      id: 'HIS-201',
      audience: 'All Students',
      message: 'Mid-term exam hall tickets will be released on the portal tomorrow.',
      sentAt: '2025-01-15 09:00 AM'
    },
    {
      id: 'HIS-202',
      audience: 'All Faculty',
      message: 'Reminder: submit internal assessment scores by Friday.',
      sentAt: '2025-01-14 05:10 PM'
    },
    {
      id: 'HIS-203',
      audience: 'HR Partners',
      message: 'Campus recruitment calendar updated with new slots.',
      sentAt: '2025-01-13 03:45 PM'
    }
  ]
}

export const roleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'hr', label: 'HR' }
]

export const branchOptions = [
  { value: 'CSE', label: 'Computer Science' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'ECE', label: 'Electronics & Communication' },
  { value: 'EEE', label: 'Electrical & Electronics' },
  { value: 'ME', label: 'Mechanical' }
]

export const eventTypes = [
  { value: 'Festival', label: 'Festival' },
  { value: 'Seminar', label: 'Seminar' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Competition', label: 'Competition' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Conference', label: 'Conference' }
]

export const approvalStatuses = ['Pending', 'Approved', 'Rejected']

