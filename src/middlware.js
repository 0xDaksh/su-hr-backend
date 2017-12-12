import Session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import socketSession from 'express-socket.io-session'
const cors = require('cors')

let session = new Session({
	secret: Math.random().toString(24).substr(7),
	saveUninitialized: true,
	resave: true
})

export default (app, io) => {
	app.use(session)
	app.use(cookieParser())
	io.use(socketSession(session, {
		autoSave: true
	}))
	app.use(cors({origin: 'http://localhost:8080', credentials: true}))
	app.use(bodyParser.json())
}
