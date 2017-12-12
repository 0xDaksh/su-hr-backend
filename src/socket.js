import User from './db/models/User'

const loginCheck = (ws, cb) => {
	if(
		typeof ws.handshake.session !== 'undefined' &&
		typeof ws.handshake.session.user !== 'undefined' &&
		typeof ws.handshake.session.user._id !== 'undefined'
	) {
		cb(ws.handshake.session.user)
	}
}
export default (ws) => {
	ws.on('walletBalance', () => loginCheck(ws, (user) => {
		User.findById(user._id, (err, user) => {
			if(err) {
				ws.emit('err', 'server-issue')
			}
			if(user) {
				ws.emit('returnWalletBalance', user.money)
			} else {
				ws.emit('err', 'no-user')
			}
		})		
	}))

	ws.on('rechargewallet', (val) => loginCheck(ws, (acc) => {
		User.findById(acc._id, (err, user) => {
			if(err) {
				ws.emit('err', 'server-issue')
			}
			if(user) {
				user.money += val
				user.save((err) => {
					if(!err) {
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
}