import expressSession from 'express-session'
const sess = new expressSession({
	secret: "yoyo-boy-showttime" + Math.random().toString(36).substr(7),
	resave: true,
	saveUninitialized: true
})

export default (app) => {
	app.use(sess)
}