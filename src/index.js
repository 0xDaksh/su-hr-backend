import express from 'express'
import routes from './routes'
import middleware from './middlware'
const app = express()

// middleware
middleware(app)

// routes
app.use('/', routes)

// export it
export {
	app
}