import User from './db/models/User'
import Booking from './db/models/Booking'

const loginCheck = (ws, cb) => {
	if (
		typeof ws.handshake.session !== 'undefined' &&
		typeof ws.handshake.session.user !== 'undefined' &&
		typeof ws.handshake.session.user._id !== 'undefined'
	) {
		cb(ws.handshake.session.user)
	}
}
export default (ws) => {
	ws.on('walletBalance', () => loginCheck(ws, (acc) => {
		User.findById(acc._id, (err, user) => {
			if (err) {
				ws.emit('err', 'server-issue')
			}
			if (user) {
				ws.emit('returnWalletBalance', user.money)
			} else {
				ws.emit('err', 'no-user')
			}
		})
	}))

	ws.on('rechargewallet', (val) => loginCheck(ws, (acc) => {
		User.findById(acc._id, (err, user) => {
			if (err) {
				ws.emit('err', 'server-issue')
			}
			if (user) {
				user.money += val
				user.save((err) => {
					if (!err) {
						ws.handshake.session.money = user.money
						ws.handshake.session.save()
						ws.emit('returnRechargeWallet', user.money)
					} else {
						ws.emit('err', 'server-issue')
					}
				})
			} else {
				ws.emit('err', 'no-user')
			}
		})
	}))
	ws.on('getBookings', () => loginCheck(ws, (acc) => {
		Booking.find({user: acc._id}).populate('hotel').exec((err, bookings) => {
			if(err) {
				ws.emit('err', 'server-issue')
			} 
			if(bookings) {
				ws.emit('returnBookings', bookings)
			} else {
				ws.emit('err', 'no-booking')
			}
		})
	}))
	ws.on('bookHotel', (id) => loginCheck(ws, acc => {
		Hotel.findById(id, (err, hotel) => {
			if(err) {
				ws.emit('err', 'server-issue')
			}
			if(hotel) {
				if(hotel.dailyRate > acc.money) {
					ws.emit('err', 'no-money')
				} else {
					User.findById(acc._id, (err, user) => {
						if(!err) {
							ws.emit('err', 'server-issue')
						} else {
							user.money -= hotel.dailyRate
							var nb = new Booking({
								user: acc._id,
								hotel: hotel._id
							})
							user.save()
							nb.save((err) => {
								if(!err) {
									ws.emit('returnBooking', true)
								} else {
									ws.emit('err', 'server-issue')
								}
							})
						}
					})
				}
			} else {
				ws.emit('err', 'no-such-hotel')
			}
		})
	}))
}