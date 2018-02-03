const express = require('express')
const router = express.Router()
const passport = require('passport')
const authenticateUser = require('../utilities/authenticate-user')

// GET /
// If logged in, default to submissions
// If not logged in, go to login page!
router.get('/', (request, response) => {
	console.log(request.session)
	let defaultHomepage = 'submissions'
	if (request.app.locals.user) response.redirect(defaultHomepage)
	else response.render('login')
})

// POST /login
// Log user in
router.post('/login', passport.authenticate('local'), (request, response)=> {
	response.redirect(request.body['attempted-url'] || 'submissions')
})

// GET /logout
// Log user out
router.get('/logout', (request, response)=> {
	request.app.locals.user = null
	request.logout()
	response.render('login', { info: "You have been logged out!" })
})

module.exports = router