import mongoose, {Schema} from 'mongoose'
const shortid = require('shortid')
const BookingSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	hotel: {type: Schema.Types.ObjectId, ref: 'Hotel'},
	status: {
		type: String,
		default: 'Started'
	},
	id: {
		type: String,
		unique: true,
		required: true,
		default: shortid.generate
	}
})

export default mongoose.model('Booking', BookingSchema)