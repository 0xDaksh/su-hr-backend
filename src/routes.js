import {Router} from 'express'
import User from './db/models/User'
import Hotel from './db/models/Hotel'
import bcrypt from 'bcryptjs'
import gravatar from 'gravatar'
const router = new Router()

const isLoggedIn = (req, res, next) => {
	if(req.session.user && typeof req.session.user !== 'undefined' && typeof req.session.user._id !== 'undefined') {
		next()
	} else {
		res.json({
			user: null,
			error: 'user is not logged in'
		})
	}
}

const isNotLoggedIn = (req, res, next) => {
	if(req.session.user && typeof req.session.user !== 'undefined' && typeof req.session.user._id !== 'undefined') {
		res.json({
			user: null,
			error: 'user is not logged in'
		})
	} else {
		next()
	}
}

router.get('/logout', isLoggedIn, (req, res) => {
	console.log('yo?')
	req.session.destroy()
	res.json({
		loggedOut: true
	})
})

router.get('/hotels', (req, res) => {
	Hotel.find({}).exec((err, hotels) => {
		if(err) {
			res.json({
				hotels: null,
				error: 'server issue'
			})
		}
		if(hotels.length > 0) {
			res.json({
				hotels: hotels.map((hotel) => {
					return {
						name: hotel.name,
						address: hotel.address,
						averageRating: hotel.averageRating,
						image: hotel.image
					}
				}),
				error: null
			})
		} else {
			res.json({
				hotels: [],
				error: null
			})
		}
	})
})

router.post('/login', isNotLoggedIn, (req, res) => {
	if(req.body.email && req.body.password && req.body.email !== '' && req.body.password !== '') {
		User.findOne({email: req.body.email}).populate('hotels').exec((err, user) => {
			if(err) {
				res.status(500).json({
					user: null,
					error: 'server issue'
				})	
			}
			if(!user) {
				res.json({
					user: null,
					error: 'wrong'
				})
			} else {
				if(bcrypt.compareSync(req.body.password, user.password)) {
					req.session.user = user
					res.json({
						user: {
							name: user.name,
							hotels: user.hotels,
							avatar: user.avatar
						},
						error: null
					})
				} else {
					res.json({
						user: null,
						error: 'wrong'
					})
				}
			}
		})
	} else {
		res.json({
			error: 'please provide email and password',
			user: null
		})
	}
})

router.post('/signup', isNotLoggedIn, (req, res) => {
	if(req.body.name && req.body.email && req.body.password && req.body.email !== '' && req.body.password !== '' && req.body.name !== '') {
		User.findOne({email: req.body.email}).populate('hotels').exec((err, user) => {
			if(err) {
				res.status(500).json({
					user: null,
					error: 'server issue'
				})	
			}
			if(!user) {
				var nu = new User({
					email: req.body.email,
					name: req.body.name,
					password: bcrypt.hashSync(req.body.password, 10),
					avatar: gravatar.url(req.body.email, { protocol: 'https', s: '500', d: 'retro' })
				})
				nu.save(err => {
					if(err) {
						res.json({
							user: null,
							error: 'anotheraccount'
						})
					} else {
						req.session.user = nu
						req.session.save()
						res.json({
							user: {
								name: req.session.user.name,
								hotels: req.session.user.hotels,
								avatar: req.session.user.avatar
							},
							error: null
						})
					}
				})
				
			} else {
				res.json({
					user: null,
					error: 'anotheraccount'
				})
			}
		})
	} else {
		res.json({
			error: 'please provide email and password',
			user: null
		})	
	}
})

router.get('/user', isLoggedIn, (req, res) => {
	res.json({
		user: {
			name: req.session.user.name,
			hotels: req.session.user.hotels,
			avatar: req.session.user.avatar
		},
		error: null
	})
})

export default router