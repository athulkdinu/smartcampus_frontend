export const activeStudentProfile = {
  id: 'STU-2043',
  name: 'athul K Dinu',
  section: 'CSE-2A',
  program: 'B.Tech · Computer Science (Sem 4)',
  facultyMentor: 'Dr. Lekshmi S Nair',
  facultyEmail: 'lekshmi.nair@smartcampus.edu'
}

// ---------------- ASSIGNMENTS ----------------
export const assignmentWorkflows = [
  {
    id: 'ASS-201',
    subject: 'Web Development',
    title: 'Responsive Frontend Interface Build',
    sections: ['CSE-2A', 'CSE-2B'],
    dueDate: '2025-01-20',
    timeLeft: '3 days',
    description: 'Build a responsive marketing page using React + Tailwind. Include hero, feature grid, and contact form.',
    attachments: 2,
    status: 'pending',
    publishedOn: '2025-01-10',
    section: 'CSE-2A',
    reviewState: 'Awaiting reviews',
    submissions: [
      {
        id: 'SUB-9001',
        studentId: 'STU-2043',
        studentName: 'Meera  K Dinu',
        fileName: 'landing-page.zip',
        fileUrl: '#',
        submittedOn: '2025-01-17 10:42 AM',
        status: 'in-review',
        remarks: 'UI improvements requested'
      },
      {
        id: 'SUB-9002',
        studentId: 'STU-2110',
        studentName: 'Adarsh',
        fileName: 'responsive-ui.zip',
        fileUrl: '#',
        submittedOn: '2025-01-16 05:15 PM',
        status: 'accepted',
        remarks: 'Meets rubric'
      }
    ]
  },
  {
    id: 'ASS-202',
    subject: 'Database Systems',
    title: 'Hospital Management ER Modeling',
    sections: ['CSE-2A'],
    dueDate: '2025-01-18',
    timeLeft: 'Submitted',
    description: 'Design an ER diagram for a multi-speciality hospital with OP billing and pharmacy modules.',
    attachments: 1,
    status: 'in-review',
    publishedOn: '2025-01-05',
    section: 'CSE-2A',
    reviewState: 'Faculty reviewing',
    submissions: [
      {
        id: 'SUB-9010',
        studentId: 'STU-2043',
        studentName: 'Meera  K Dinu',
        fileName: 'hospital-er.pdf',
        fileUrl: '#',
        submittedOn: '2025-01-14 08:30 PM',
        status: 'accepted',
        remarks: 'Consider adding pharmacy offers section.'
      }
    ]
  },
  {
    id: 'ASS-203',
    subject: 'Operating Systems',
    title: 'CPU Scheduling Algorithm Analysis',
    sections: ['CSE-2A', 'CSE-2C'],
    dueDate: '2025-01-22',
    timeLeft: '5 days',
    description: 'Compare CPU scheduling algorithms with real-time telemetry captured from PerfMon.',
    attachments: 0,
    status: 'pending',
    publishedOn: '2025-01-12',
    section: 'CSE-2A',
    reviewState: 'Submissions not opened',
    submissions: [
      {
        id: 'SUB-9051',
        studentId: 'STU-2113',
        studentName: 'Nimisha Suresh',
        fileName: 'scheduler-report.docx',
        fileUrl: '#',
        submittedOn: '2025-01-18 03:10 PM',
        status: 'needs-resubmission',
        remarks: 'Add Round Robin comparison'
      }
    ]
  }
]

// ---------------- LEAVE REQUESTS ----------------
export const leaveRequestTickets = [
  {
    id: 'LV-301',
    studentId: 'STU-2043',
    studentName: 'Meera  K Dinu',
    section: 'CSE-2A',
    startDate: '2025-01-20',
    endDate: '2025-01-22',
    reason: 'Family emergency',
    status: 'pending',
    submittedAt: '2025-01-15',
    advisor: 'Dr. Lekshmi S Nair',
    documents: 1
  },
  {
    id: 'LV-302',
    studentId: 'STU-2043',
    studentName: 'Meera  K Dinu',
    section: 'CSE-2A',
    startDate: '2025-01-10',
    endDate: '2025-01-10',
    reason: 'Medical appointment',
    status: 'approved',
    submittedAt: '2025-01-08',
    advisor: 'Dr. Lekshmi S Nair',
    documents: 2
  },
  {
    id: 'LV-303',
    studentId: 'STU-2110',
    studentName: 'Adarsh',
    section: 'CSE-2B',
    startDate: '2025-01-05',
    endDate: '2025-01-06',
    reason: 'Hackathon finals',
    status: 'rejected',
    submittedAt: '2025-01-02',
    advisor: 'Prof. Arun Krishnan',
    documents: 0
  }
]

// ---------------- COMPLAINTS ----------------
export const complaintTickets = [
  {
    id: 'CMP-501',
    studentId: 'STU-2043',
    studentName: 'athul K Dinu',
    department: 'Computer Science',
    section: 'CSE-2A',
    category: 'Infrastructure',
    title: 'Network Instability in Library Block',
    text: 'Wi-Fi disconnects every 5 minutes in reading hall A.',
    status: 'pending',
    submittedAt: '2025-01-14',
    priority: 'high',
    assignedFaculty: 'Dr. Lekshmi S Nair',
    forwardedToAdmin: false
  },
  {
    id: 'CMP-502',
    studentId: 'STU-2110',
    studentName: 'Adarsh',
    department: 'Computer Science',
    section: 'CSE-2B',
    category: 'Services',
    title: 'Cafeteria Service Quality Issue',
    text: 'Meals served cold during lunch hours.',
    status: 'in-review',
    submittedAt: '2025-01-12',
    priority: 'medium',
    assignedFaculty: 'Prof. Arun Krishnan',
    forwardedToAdmin: false
  },
  {
    id: 'CMP-503',
    studentId: 'STU-2078',
    studentName: 'Sandra',
    department: 'Computer Science',
    section: 'CSE-2A',
    category: 'Infrastructure',
    title: 'Classroom Cooling Failure (A-101)',
    text: 'AC in room A-101 has been down for a week.',
    status: 'forwarded',
    submittedAt: '2025-01-10',
    priority: 'high',
    assignedFaculty: 'Dr. Lekshmi S Nair',
    forwardedToAdmin: true
  }
]

// ---------------- EVENT PROPOSALS ----------------
export const eventProposals = [
  {
    id: 'EVP-101',
    title: 'GenAI Code Sprint 2025',
    description: 'Overnight build sprint focusing on GenAI prototypes.',
    date: '2025-02-10',
    time: '05:00 PM',
    location: 'Innovation Lab',
    facultyInCharge: 'Dr. Lekshmi S Nair',
    status: 'pending',
    section: 'CSE-2A',
    submittedBy: 'athul K Dinu',
    studentId: 'STU-2043',
    submittedAt: '2025-01-16',
    origin: 'CodeCraft Club',
    forwardedToAdmin: true
  },
  {
    id: 'EVP-102',
    title: 'Tech Career Acceleration Forum',
    description: 'Peer-led mentoring circles with alumni drop-ins.',
    date: '2025-02-25',
    time: '11:00 AM',
    location: 'Think Tank Room',
    facultyInCharge: 'Prof. Arun Krishnan',
    status: 'forwarded',
    section: 'CSE-2B',
    submittedBy: 'Adarsh',
    studentId: 'STU-2110',
    submittedAt: '2025-01-12',
    origin: 'CSE Leadership Council',
    forwardedToAdmin: true
  },
  {
    id: 'EVP-103',
    title: 'Sustainable Tech & Green Computing Drive',
    description: 'Tree plantation and sustainability workshops with local NGOs.',
    date: '2025-03-05',
    time: '09:00 AM',
    location: 'Central Courtyard',
    facultyInCharge: 'Dr. Kavya Mohan',
    status: 'rejected',
    section: 'EEE-3A',
    submittedBy: 'Sandra',
    studentId: 'STU-2078',
    submittedAt: '2025-01-18',
    origin: 'Eco Club',
    forwardedToAdmin: true
  }
]

// ---------------- SKILL PROGRAMS ----------------
export const skillProgramCatalogue = [
  {
    id: 'SKL-701',
    title: 'MERN Stack Deployment Bootcamp',
    description: '4-week guided build focusing on MERN stack deployments.',
    duration: '4 weeks',
    format: 'Hybrid',
    materials: ['Curriculum.pdf', 'Demo Walkthrough.mp4'],
    status: 'published',
    createdBy: 'Dr. Lekshmi S Nair',
    publishedOn: '2025-01-12',
    sections: ['CSE-2A', 'CSE-2B'],
    highlight: 'Includes CI/CD starter kit'
  },
  {
    id: 'SKL-702',
    title: 'Data Visualization & Narrative Analytics',
    description: 'Narrative dashboards using Power BI + Observable.',
    duration: '3 weeks',
    format: 'Virtual',
    materials: ['Storytelling Canvas.pdf'],
    status: 'upcoming',
    createdBy: 'Prof. Arun Krishnan',
    publishedOn: '2025-01-18',
    sections: ['CSE-2A', 'ECE-3A'],
    highlight: 'Capstone review with analytics team'
  },
  {
    id: 'SKL-703',
    title: 'Linux Systems & Kernel Internals Lab',
    description: 'Kernel module walkthroughs and perf instrumentation.',
    duration: '2 weeks',
    format: 'On-campus',
    materials: ['Kernel Lab Guide.pdf'],
    status: 'draft',
    createdBy: 'Dr. Lekshmi S Nair',
    publishedOn: '2025-01-05',
    sections: ['CSE-2A'],
    highlight: 'Limited seats · 25 learners'
  }
]
