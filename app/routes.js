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
  if (!Number.isNaN(idNum)) {
    const target = saved.find(c => c && c.id === idNum)
    if (target) {
      target.note = (noteText || '').trim()
    }
  } else if (!Number.isNaN(idx) && saved[idx]) {
    saved[idx].note = (noteText || '').trim()
  }
  req.session.data.savedCourses = saved
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

// Debug: dump current session data as formatted JSON
router.get('/debug-session', (req, res) => {
  res.type('application/json').send(JSON.stringify(req.session?.data || {}, null, 2))
})

module.exports = router
