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

const throwServerIssue = (res, prop) => {
	let obj = {
		error: 'server issue'
	}
	obj[prop] = null
	res.json(obj)
}

router.get('/logout', isLoggedIn, (req, res) => {
	req.session.destroy()
	res.json({
		loggedOut: true
	})
})

router.post('/book', isLoggedIn, (req, res) => {
	if(req.body.id && req.body.id !== '') {
		Hotel.findOne({id: req.body.id}).exec((err, hotel) => {
			if(err) {
				throwServerIssue(res, 'booked')
			} else {
				if(!hotel) {
					res.json({
						error: 'no hotel found',
						booked: null
					})
				} else {
					User.findById(req.session.user._id, (err, user) => {
						user.hotels.push(hotel._id)
						hotel.users.push(user._id)
						hotel.save()
						user.save()
					})
					res.json({
						error: null,
						booked: true
					})
				}
			}
		})
	} else {
		res.json({
			error: 'id wasnt provided',
			booked: null			
		})
	}
})

router.get('/hotels/:id', (req, res) => {
	if(req.params.id !== '') {
		Hotel.findOne({id: req.params.id}, (err, hotel) => {
			if(err) {
				throwServerIssue(res, 'hotel')
			}
			if(!hotel) {
				res.json({
					error: 'hotel not found',
					hotel: null
				})	
			} else {
				res.json({
					hotel: {
						name: hotel.name,
						address: hotel.address,
						averageRating: hotel.averageRating,
						image: hotel.image, 
						id: hotel.id
					},
					error: null
				})
			}
		})		
	} else {
		res.json({
			error: 'hotel not found',
			hotel: null
		})
	}
})

router.get('/hotels', (req, res) => {
	Hotel.find({}).exec((err, hotels) => {
		if(err) {
			throwServerIssue(res, 'hotels')
		}
		if(hotels.length > 0) {
			res.json({
				hotels: hotels.map((hotel) => {
					return {
						name: hotel.name,
						address: hotel.address,
						averageRating: hotel.averageRating,
						image: hotel.image,
						id: hotel.id
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
				throwServerIssue(res, 'user')
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
				throwServerIssue(res, 'user')
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