import mongoose, {Schema} from 'mongoose'

const HotelSchema = new Schema({
	name: String,
	address: String,
	users: [{type: mongoose.Types.ObjectId, ref: 'User'}],
	averageRating: Number
})