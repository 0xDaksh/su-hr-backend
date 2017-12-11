import express from 'express'
import routes from './routes'
import middleware from './middlware'
import startDB from './db/start'
const app = express()

// start the database boy.
startDB()

// middleware
middleware(app)

// routes
app.use('/', routes)

// export it
export {
	app
}