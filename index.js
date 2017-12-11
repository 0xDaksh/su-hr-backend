require('babel-register')({
	presets: ['es2015', 'es2017']
})

var server = require('./src/index')

server.listen(process.env.PORT || 8000, () => {
	console.log('express server has been started.')
})