const log = require('winston')

module.exports = async function(app) {

	// Dependencies
	const express = require('express')
	const router = express.Router()

	// Setup
	app.use('/', 			require('../login/routes'))
	app.use('/', 			require('../email/routes'))
	app.use('/apply', 		require('../apply/routes'))
	app.use('/submissions', require('../submissions/routes'))
	app.use('/users', 		require('../users/routes'))
	app.use('/hosts',		require('../hosts/routes'))

	// API! Experimental!
	app.use('/api/host', require('../hosts/api.routes'))

	// Home Page (Login screen)
	app.use(router.get('/', (request, response) => {

		let isProductionEnvironment = (process.env.NODE_ENV == 'production')
		console.log("is production", isProductionEnvironment)
		let isHttps = (request.headers['x-forwarded-proto'] == 'https')
		console.log("ishttps", isHttps)
		if (isProductionEnvironment && !isHttps) {
			console.log("Redirect: " + 'https://' + request.hostname + request.url)
			response.redirect('https://' + request.hostname + request.url)
		}
		else {
			response.render('/login')
		}
	}))

	// Catch-all, creates 404 error
	app.use((request, response, next)=> {
		let error = new Error("Not found")
		//error.status = 404
		next(error)
	})

	// Error page!
	app.use((error, request, response, next)=> {
		response.status(error.status || 500)
		log.error("Errorrrrr :(", error)
		response.render('error', { error: error })
	})

	log.info("✅  Routes")
}