import express from 'express'
import routes from './routes'
import middleware from './middlware'
import startDB from './db/start'
import socketIO from 'socket.io'
import socketHandler from './socket'
const app = express()
const server = require('http').createServer(app)
var io = socketIO(server)
// start the database boy.
startDB()

// middleware
middleware(app, io)

// routes
app.use('/', routes)

// socket.io
io.on('connection', (ws) => {
	socketHandler(ws)
})

// export it
export {
	server
}