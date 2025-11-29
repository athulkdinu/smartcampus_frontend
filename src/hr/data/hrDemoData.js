export const hrJobOpenings = [
  {
    id: 'JOB-301',
    title: 'Software Intern – Platform Engineering',
    company: 'NextWave Labs',
    jobType: 'Internship',
    location: 'Hybrid · Bengaluru',
    salary: '₹35,000 / month',
    eligibility: {
      departments: ['CSE', 'IT'],
      cgpa: '7.5+',
      skills: ['React', 'Node.js', 'REST APIs']
    },
    description: 'Work with the platform squad to build internal dashboards and automation workflows.',
    responsibilities: [
      'Ship UI components with React + Tailwind',
      'Automate deploy pipelines with GitHub Actions',
      'Collaborate with mentors for weekly demos'
    ],
    deadline: '2024-12-20',
    status: 'Active',
    applications: 78,
    lastUpdated: '1 hour ago'
  },
  {
    id: 'JOB-302',
    title: 'Data Analyst Intern',
    company: 'Insight Analytics',
    jobType: 'Internship',
    location: 'Remote',
    salary: '₹28,000 / month',
    eligibility: {
      departments: ['CSE', 'ECE'],
      cgpa: '7.0+',
      skills: ['Python', 'Power BI', 'SQL']
    },
    description: 'Assist senior analysts with dashboard builds and KPI automation.',
    responsibilities: [
      'Clean and transform large data sets',
      'Publish weekly Power BI dashboards',
      'Partner with business stakeholders for insights'
    ],
    deadline: '2024-12-18',
    status: 'Screening',
    applications: 42,
    lastUpdated: 'Yesterday'
  },
  {
    id: 'JOB-303',
    title: 'Backend Developer – Graduate Program',
    company: 'PixelCraft Systems',
    jobType: 'Full-time',
    location: 'On-site · Pune',
    salary: '₹9.5 LPA',
    eligibility: {
      departments: ['CSE', 'IT'],
      cgpa: '7.8+',
      skills: ['Java', 'Spring Boot', 'SQL']
    },
    description: 'Join the graduate program focused on scalable API development.',
    responsibilities: [
      'Design REST services with Spring Boot',
      'Write integration tests and observability hooks',
      'Work with product managers on sprint goals'
    ],
    deadline: '2024-12-28',
    status: 'Draft',
    applications: 25,
    lastUpdated: '2 days ago'
  }
]

export const hrApplications = [
  {
    id: 'APP-1201',
    jobId: 'JOB-301',
    studentName: 'athul K Dinu',
    course: 'B.Tech',
    department: 'CSE',
    skills: ['React', 'Tailwind', 'Node.js'],
    certifications: ['AWS Cloud Practitioner'],
    projects: ['Realtime chat platform', 'Course planner'],
    resume: 'https://smartcampus.link/resume/athul',
    gpa: '8.6',
    status: 'Pending',
    submittedAt: '2024-12-03',
    experience: '2 internships',
    match: 92
  },
  {
    id: 'APP-1202',
    jobId: 'JOB-302',
    studentName: 'Meera ',
    course: 'B.Tech',
    department: 'ECE',
    skills: ['Python', 'Power BI', 'Tableau'],
    certifications: ['Google Data Analytics'],
    projects: ['Hospital KPI dashboard', 'Time series forecaster'],
    resume: 'https://smartcampus.link/resume/meera',
    gpa: '8.2',
    status: 'Shortlisted',
    submittedAt: '2024-12-04',
    experience: 'Hackathon finalist',
    match: 88
  },
  {
    id: 'APP-1203',
    jobId: 'JOB-301',
    studentName: 'Rahul Nambiar',
    course: 'B.Tech',
    department: 'IT',
    skills: ['Express', 'MongoDB', 'Docker'],
    certifications: ['Node.js Nanodegree'],
    projects: ['Issue tracker', 'Telemetry exporter'],
    resume: 'https://smartcampus.link/resume/rahul',
    gpa: '7.9',
    status: 'Interview Scheduled',
    submittedAt: '2024-12-01',
    experience: 'Freelance dev',
    match: 85
  },
  {
    id: 'APP-1204',
    jobId: 'JOB-302',
    studentName: 'Juhi Menon',
    course: 'B.Tech',
    department: 'CSE',
    skills: ['SQL', 'R', 'Power BI'],
    certifications: ['Microsoft Data Analyst'],
    projects: ['Customer churn predictor'],
    resume: 'https://smartcampus.link/resume/juhi',
    gpa: '8.1',
    status: 'Rejected',
    submittedAt: '2024-11-30',
    experience: '1 internship',
    match: 73
  }
]

export const hrPipelineSummary = {
  pending: 68,
  shortlisted: 24,
  interviewed: 15,
  offered: 9,
  rejected: 19
}

export const hrActivities = [
  { title: 'New application – athul K Dinu (Software Intern)', time: '8 mins ago' },
  { title: 'Interview Scheduled – Data Analyst Intern', time: '30 mins ago' },
  { title: 'Offer Released – Backend Developer Role', time: '1 hour ago' },
  { title: 'Job Post Updated – TCS Developer Intern', time: 'Yesterday' }
]

export const hrShortlist = hrApplications
  .filter(app => app.status === 'Shortlisted')
  .map(app => ({
    ...app,
    shortlistedOn: '2024-12-04'
  }))

export const hrInterviewSchedule = [
  {
    id: 'INT-501',
    candidate: 'Meera ',
    jobId: 'JOB-302',
    jobTitle: 'Data Analyst Intern',
    mode: 'Online',
    date: '2024-12-08',
    time: '11:30 AM',
    round: 'Technical',
    interviewer: 'Priya Singh',
    status: 'Scheduled'
  },
  {
    id: 'INT-502',
    candidate: 'Rahul Nambiar',
    jobId: 'JOB-301',
    jobTitle: 'Software Intern – Platform Engineering',
    mode: 'Offline',
    date: '2024-12-09',
    time: '10:00 AM',
    round: 'Managerial',
    interviewer: 'Sandeep Rao',
    status: 'Awaiting'
  }
]

export const hrResults = {
  selected: [
    {
      candidate: 'Meera ',
      jobTitle: 'Data Analyst Intern',
      offerId: 'OFF-8801',
      package: '₹28,000 / month',
      status: 'Offer Ready'
    },
    {
      candidate: 'Rahul Nambiar',
      jobTitle: 'Software Intern – Platform Engineering',
      offerId: 'OFF-8802',
      package: '₹35,000 / month',
      status: 'Offer Drafted'
    }
  ],
  rejected: [
    {
      candidate: 'Juhi Menon',
      jobTitle: 'Data Analyst Intern',
      reason: 'Skill alignment low',
      reviewed: false
    },
    {
      candidate: 'Arjun Das',
      jobTitle: 'Backend Developer – Graduate Program',
      reason: 'Did not clear technical round',
      reviewed: true
    }
  ]
}

export const applicationStatuses = ['Pending', 'Shortlisted', 'Interview Scheduled', 'Offered', 'Rejected']

// Legacy exports for backward compatibility
export const jobPostings = hrJobOpenings
export const applications = hrApplications
export const interviewPipeline = hrInterviewSchedule
export const assessments = []
export const assessmentQuestionBank = []
export const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Screening', label: 'Screening' },
  { value: 'Closed', label: 'Closed' }
]

