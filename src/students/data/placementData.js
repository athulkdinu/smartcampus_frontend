// Mock data for Student Placement & Internship module
// This file is intentionally self-contained so it can be swapped with real API calls later.

export const placementDrives = [
  {
    id: 'JOB-301',
    title: 'Software Intern – Platform Engineering',
    company: 'NextWave Labs',
    location: 'Hybrid · Bengaluru',
    type: 'Internship',
    lastDateToApply: '2024-12-20',
    eligibilitySummary: 'CSE / IT · CGPA 7.5+ · React, Node.js',
    status: 'Open'
  },
  {
    id: 'JOB-302',
    title: 'Data Analyst Intern',
    company: 'Insight Analytics',
    location: 'Remote',
    type: 'Internship',
    lastDateToApply: '2024-12-18',
    eligibilitySummary: 'CSE / ECE · CGPA 7.0+ · Python, Power BI',
    status: 'Open'
  },
  {
    id: 'JOB-303',
    title: 'Backend Developer – Graduate Program',
    company: 'PixelCraft Systems',
    location: 'On-site · Pune',
    type: 'Full-time',
    lastDateToApply: '2024-12-28',
    eligibilitySummary: 'CSE / IT · CGPA 7.8+ · Java, Spring Boot',
    status: 'Open'
  }
]

export const placementApplicationsSeed = [
  {
    id: 'APP-1201',
    jobId: 'JOB-301',
    title: 'Software Intern – Platform Engineering',
    company: 'NextWave Labs',
    status: 'Shortlisted',
    lastUpdated: '2 days ago'
  },
  {
    id: 'APP-1202',
    jobId: 'JOB-302',
    title: 'Data Analyst Intern',
    company: 'Insight Analytics',
    status: 'Interview Scheduled',
    lastUpdated: '1 day ago'
  },
  {
    id: 'APP-1203',
    jobId: 'JOB-303',
    title: 'Backend Developer – Graduate Program',
    company: 'PixelCraft Systems',
    status: 'Rejected',
    lastUpdated: '1 week ago'
  }
]

export const placementInterviewsSeed = [
  {
    id: 'INT-501',
    jobId: 'JOB-302',
    title: 'Data Analyst Intern',
    company: 'Insight Analytics',
    mode: 'Online',
    roundType: 'Technical',
    date: '2024-12-08',
    time: '11:30 AM',
    status: 'Scheduled'
  },
  {
    id: 'INT-502',
    jobId: 'JOB-301',
    title: 'Software Intern – Platform Engineering',
    company: 'NextWave Labs',
    mode: 'Offline',
    roundType: 'HR',
    date: '2024-12-10',
    time: '10:00 AM',
    status: 'Completed'
  }
]

export const placementOffersSeed = [
  {
    id: 'OFF-8801',
    jobId: 'JOB-302',
    title: 'Data Analyst Intern',
    company: 'Insight Analytics',
    ctc: '₹28,000 / month',
    status: 'Pending'
  },
  {
    id: 'OFF-8802',
    jobId: 'JOB-301',
    title: 'Software Intern – Platform Engineering',
    company: 'NextWave Labs',
    ctc: '₹35,000 / month',
    status: 'Accepted'
  }
]


