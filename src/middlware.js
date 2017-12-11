import expressSession from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
const sess = new expressSession({
	secret: "yoyo-boy-showttime" + Math.random().toString(36).substr(7),
	resave: true,
	saveUninitialized: true
})

export default (app) => {
	app.use(cookieParser())
	app.use(bodyParser.urlencoded({extended: false}))
	app.use(sess)
}