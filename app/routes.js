//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

// Ensure each saved course has a stable id for independent updates
router.use((req, res, next) => {
  const saved = req.session?.data?.savedCourses
  if (Array.isArray(saved)) {
    let changed = false
    saved.forEach((c, i) => {
      if (c && typeof c.id === 'undefined') {
        c.id = i
        changed = true
      }
    })
    if (changed) {
      req.session.data.savedCourses = saved
    }
  }
  next()
})

// Handle Add note submission
router.post('/add-note', (req, res) => {
  const { courseIndex, courseId, noteText } = req.body || {}
  const saved = req.session.data.savedCourses || []
  const idNum = Number.isFinite(parseInt(courseId, 10)) ? parseInt(courseId, 10) : NaN
  const idx = Number.isFinite(parseInt(courseIndex, 10)) ? parseInt(courseIndex, 10) : NaN
  let targetCourse = null
  let wasExistingNote = false
  if (!Number.isNaN(idNum)) {
    targetCourse = saved.find(c => c && c.id === idNum) || null
    if (targetCourse) {
      wasExistingNote = !!(targetCourse.note && String(targetCourse.note).trim())
      targetCourse.note = (noteText || '').trim()
    }
  } else if (!Number.isNaN(idx) && saved[idx]) {
    targetCourse = saved[idx]
    wasExistingNote = !!(targetCourse.note && String(targetCourse.note).trim())
    targetCourse.note = (noteText || '').trim()
  }
  req.session.data.savedCourses = saved

  // Flash success banner for Saved courses
  if (req.session?.data) {
    const courseName = targetCourse ? `${targetCourse.provider} - ${targetCourse.title}` : 'this course'
    req.session.data.noteFlash = {
      title: wasExistingNote ? 'Note updated' : 'Note added',
      message: `Your note has been ${wasExistingNote ? 'changed' : 'added'} to ${courseName}.`
    }
  }

  // Clear transient params to avoid future confusion
  if (req.session?.data) {
    delete req.session.data.id
    delete req.session.data.index
    delete req.session.data.i
    delete req.session.data.courseId
    delete req.session.data.courseIndex
    delete req.session.data.noteText
  }
  return res.redirect('/saved-courses')
})

// Render Saved courses and clear any one-time flash banner
router.get('/saved-courses', (req, res) => {
  const flash = req.session?.data?.noteFlash || null
  if (req.session?.data?.noteFlash) {
    delete req.session.data.noteFlash
  }
  return res.render('saved-courses', { noteFlash: flash })
})

// Delete a note from a saved course (by id, fallback to index)
router.get('/delete-note', (req, res) => {
  const saved = req.session.data.savedCourses || []
  const idNum = Number.isFinite(parseInt(req.query?.id, 10)) ? parseInt(req.query.id, 10) : NaN
  const idx = Number.isFinite(parseInt(req.query?.index, 10)) ? parseInt(req.query.index, 10) : NaN

  let targetCourse = null
  if (!Number.isNaN(idNum)) {
    targetCourse = saved.find(c => c && c.id === idNum) || null
  } else if (!Number.isNaN(idx) && saved[idx]) {
    targetCourse = saved[idx]
  }

  if (targetCourse) {
    const previousNote = targetCourse.note || ''
    targetCourse.note = ''
    req.session.data.savedCourses = saved

    // Store undo payload
    req.session.data.deletedNote = {
      courseId: targetCourse.id,
      note: previousNote
    }

    // Flash success banner
    const courseName = `${targetCourse.provider} - ${targetCourse.title}`
    req.session.data.noteFlash = {
      title: 'Note deleted',
      message: `Your note for ${courseName} has been deleted.`,
      linkText: 'Undo',
      linkHref: `/undo-delete-note?id=${targetCourse.id}`
    }
  }

  return res.redirect('/saved-courses')
})

// Undo deleting a note (restores last deleted note for that course)
router.get('/undo-delete-note', (req, res) => {
  const saved = req.session.data.savedCourses || []
  const idNum = Number.isFinite(parseInt(req.query?.id, 10)) ? parseInt(req.query.id, 10) : NaN
  const payload = req.session?.data?.deletedNote

  if (!Number.isNaN(idNum) && payload && payload.courseId === idNum) {
    const targetCourse = saved.find(c => c && c.id === idNum) || null
    if (targetCourse) {
      targetCourse.note = payload.note || ''
      req.session.data.savedCourses = saved
      delete req.session.data.deletedNote
    }
  }

  // Ensure no banner is shown after undo
  if (req.session?.data?.noteFlash) {
    delete req.session.data.noteFlash
  }

  return res.redirect('/saved-courses')
})

// Remove a saved course (by id, fallback to index)
router.get('/unsave-course', (req, res) => {
  const saved = req.session.data.savedCourses || []
  const idNum = Number.isFinite(parseInt(req.query?.id, 10)) ? parseInt(req.query.id, 10) : NaN
  const idx = Number.isFinite(parseInt(req.query?.index, 10)) ? parseInt(req.query.index, 10) : NaN

  let removedCourse = null
  let removedIndex = -1

  if (!Number.isNaN(idNum)) {
    removedIndex = saved.findIndex(c => c && c.id === idNum)
  } else if (!Number.isNaN(idx)) {
    removedIndex = idx
  }

  if (removedIndex > -1 && saved[removedIndex]) {
    removedCourse = saved[removedIndex]
    const nextSaved = saved.filter((_, i) => i !== removedIndex)
    req.session.data.savedCourses = nextSaved

    // Store undo payload (one deep)
    req.session.data.deletedSavedCourse = {
      course: removedCourse,
      index: removedIndex
    }

    // Flash success banner (matches screenshot)
    const courseName = `${removedCourse.provider} - ${removedCourse.title}`
    req.session.data.noteFlash = {
      title: 'Saved course deleted',
      message: `${courseName}.`,
      linkText: 'Undo',
      linkHref: `/undo-unsave-course?id=${removedCourse.id}`
    }
  }

  return res.redirect('/saved-courses')
})

// Undo removing a saved course (restores last removed course; no banner on return)
router.get('/undo-unsave-course', (req, res) => {
  const saved = req.session.data.savedCourses || []
  const idNum = Number.isFinite(parseInt(req.query?.id, 10)) ? parseInt(req.query.id, 10) : NaN
  const payload = req.session?.data?.deletedSavedCourse

  if (!Number.isNaN(idNum) && payload && payload.course && payload.course.id === idNum) {
    const insertIndex = Number.isFinite(parseInt(payload.index, 10)) ? parseInt(payload.index, 10) : 0
    const nextSaved = saved.slice()
    nextSaved.splice(Math.max(0, Math.min(insertIndex, nextSaved.length)), 0, payload.course)
    req.session.data.savedCourses = nextSaved
    delete req.session.data.deletedSavedCourse
  }

  // Ensure no banner is shown after undo
  if (req.session?.data?.noteFlash) {
    delete req.session.data.noteFlash
  }

  return res.redirect('/saved-courses')
})

// Handle Create email alert submission
router.post('/email-alert-new', (req, res) => {
  const { alertTitle, subject, location, feeOrSalary, studyMode, qualification, startDate, visaSponsorship } = req.body || {}
  const alerts = req.session.data.emailAlerts || []
  const nextId = alerts.reduce((m, a) => (a && typeof a.id === 'number' && a.id > m ? a.id : m), -1) + 1

  const criteria = []
  if (subject) criteria.push({ key: 'Subject', value: subject })
  if (location) criteria.push({ key: 'Location', value: location })
  if (feeOrSalary) criteria.push({ key: 'Fee or salary', value: feeOrSalary })
  if (studyMode) criteria.push({ key: 'Full time or part time', value: studyMode })
  if (qualification) criteria.push({ key: 'Qualification', value: qualification })
  if (startDate) criteria.push({ key: 'Start date', value: startDate })
  if (visaSponsorship) criteria.push({ key: 'Visa sponsorship', value: visaSponsorship })

  alerts.unshift({
    id: nextId,
    title: alertTitle || 'Email alert',
    criteria
  })
  req.session.data.emailAlerts = alerts

  // Flash success banner for Email alerts
  req.session.data.emailAlertFlash = {
    heading: 'Email alert created',
    messageLine1: `You have set up an email alert for ${alertTitle || 'this search'}.`,
    messageLine2: 'We will send you emails about new courses every Monday at 3pm. You can',
    linkText: 'unsubscribe',
    linkHref: '#',
    messageLine3: 'at any time.'
  }

  return res.redirect('/email-alerts')
})

// Render Email alerts and clear any one-time flash banner
router.get('/email-alerts', (req, res) => {
  const flash = req.session?.data?.emailAlertFlash || null
  if (req.session?.data?.emailAlertFlash) {
    delete req.session.data.emailAlertFlash
  }
  return res.render('email-alerts', { emailAlertFlash: flash })
})

// Debug: dump current session data as formatted JSON
router.get('/debug-session', (req, res) => {
  res.type('application/json').send(JSON.stringify(req.session?.data || {}, null, 2))
})

module.exports = router
