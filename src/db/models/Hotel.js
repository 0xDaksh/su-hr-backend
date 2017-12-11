import mongoose, {Schema} from 'mongoose'

const HotelSchema = new Schema({
	name: String,
	address: String,
	users: [{type: Schema.Types.ObjectId, ref: 'User'}],
	averageRating: Number
})

export default mongoose.model('Hotel', HotelSchema)