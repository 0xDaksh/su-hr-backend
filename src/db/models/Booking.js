import mongoose, {Schema} from 'mongoose'
const shortid = require('shortid')
const BookingSchema = new Schema({
	of: {type: Schema.Types.ObjectId, ref: 'User'},
	on: {type: Schema.Types.ObjectId, ref: 'Hotel'},
	id: {
		type: String,
		unique: true,
		required: true,
		default: shortid.generate
	}
})

export default mongoose.model('Booking', BookingSchema)