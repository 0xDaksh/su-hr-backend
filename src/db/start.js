import mongoose from 'mongoose'

export default () => {
	mongoose.connect(require('./config').url)
}