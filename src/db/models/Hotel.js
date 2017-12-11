import mongoose, {Schema} from 'mongoose'
const shortid = require('shortid')
const HotelSchema = new Schema({
	name: String,
	address: String,
	users: [{type: Schema.Types.ObjectId, ref: 'User'}],
	averageRating: Number,
	image: String,
	id: {
		type: String,
		unique: true,
		required: true,
		default: shortid.generate
	}
})

export default mongoose.model('Hotel', HotelSchema)