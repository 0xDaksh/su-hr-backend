import mongoose from 'mongoose'
import config from './config'

mongoose.Promise = global.Promise

export default () => {
	mongoose.connect(config.url)
}