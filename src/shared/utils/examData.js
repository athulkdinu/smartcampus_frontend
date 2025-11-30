// Shared exam data utility using localStorage
// This will be replaced with backend API later

const EXAM_STORAGE_KEY = 'smart_campus_exams'

export const getExams = () => {
  try {
    const stored = localStorage.getItem(EXAM_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading exams from storage:', error)
    return []
  }
}

export const saveExam = (exam) => {
  try {
    const exams = getExams()
    const newExam = {
      examId: Date.now().toString(),
      examTitle: exam.examTitle,
      examRoom: exam.examRoom,
      subjects: [],
      createdAt: new Date().toISOString()
    }
    exams.push(newExam)
    localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(exams))
    return newExam
  } catch (error) {
    console.error('Error saving exam to storage:', error)
    throw error
  }
}

export const addSubjectToExam = (examId, subject) => {
  try {
    const exams = getExams()
    const examIndex = exams.findIndex(exam => exam.examId === examId)
    
    if (examIndex === -1) {
      throw new Error('Exam not found')
    }

    const newSubject = {
      subId: Date.now().toString(),
      subjectName: subject.subjectName,
      date: subject.date,
      time: subject.time
    }

    exams[examIndex].subjects.push(newSubject)
    localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(exams))
    return newSubject
  } catch (error) {
    console.error('Error adding subject to exam:', error)
    throw error
  }
}

export const deleteExam = (examId) => {
  try {
    const exams = getExams()
    const filtered = exams.filter(exam => exam.examId !== examId)
    localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(filtered))
    return filtered
  } catch (error) {
    console.error('Error deleting exam from storage:', error)
    throw error
  }
}

// Initialize with some mock data if storage is empty
export const initializeMockExams = () => {
  const existing = getExams()
  if (existing.length === 0) {
    const mockExams = [
      {
        examId: '1',
        examTitle: 'Final Exam',
        examRoom: 'A-205',
        subjects: [
          {
            subId: '1-1',
            subjectName: 'Data Structures',
            date: '2025-02-15',
            time: '09:00'
          },
          {
            subId: '1-2',
            subjectName: 'Web Development',
            date: '2025-02-16',
            time: '10:00'
          }
        ],
        createdAt: new Date().toISOString()
      },
      {
        examId: '2',
        examTitle: 'Supplementary Exam',
        examRoom: 'B-301',
        subjects: [
          {
            subId: '2-1',
            subjectName: 'Database Systems',
            date: '2025-03-01',
            time: '14:00'
          }
        ],
        createdAt: new Date().toISOString()
      }
    ]
    localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(mockExams))
  }
}
