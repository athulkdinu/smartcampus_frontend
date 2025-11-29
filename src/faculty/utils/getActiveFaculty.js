import { facultyProfiles } from '../data/facultyDemoData'

export const getActiveFacultyProfile = () => {
  if (typeof window === 'undefined') {
    return facultyProfiles[0]
  }

  const storedId = window.localStorage.getItem('activeFacultyId')
  const profile = facultyProfiles.find(faculty => faculty.id === storedId)
  return profile || facultyProfiles[0]
}

