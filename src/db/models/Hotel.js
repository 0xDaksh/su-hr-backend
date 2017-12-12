import mongoose, {Schema} from 'mongoose'
const shortid = require('shortid')
const HotelSchema = new Schema({
	name: String,
	address: String,
	averageRating: Number,
	image: String,
	id: {
		type: String,
		unique: true,
		required: true,
		default: shortid.generate
	},
	dailyRate: Number
})

export default mongoose.model('Hotel', HotelSchema)