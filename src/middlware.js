import Session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
const cors = require('cors')

let session = new Session({
	secret: Math.random().toString(24).substr(7),
	saveUninitialized: true,
	resave: true
})

export default (app) => {
	app.use(session)
	app.use(cors({origin: 'https://stayunclehiring.surge.sh', credentials: true}))
	app.use(cookieParser())
	app.use(bodyParser.json())
}
