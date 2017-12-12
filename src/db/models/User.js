import mongoose, {Schema} from 'mongoose'

const UserSchema = new Schema({
	name: String,
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	bookings: [{type: Schema.Types.ObjectId, ref: 'Booking'}],
	avatar: String,
	money: Number
})

module.exports = mongoose.model('User', UserSchema)