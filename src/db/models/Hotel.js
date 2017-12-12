import mongoose, {Schema} from 'mongoose'
const shortid = require('shortid')
const HotelSchema = new Schema({
	name: String,
	address: String,
	bookings: [{type: Schema.Types.ObjectId, ref: 'Booking'}],
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