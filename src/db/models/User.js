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
	hotels: [{type: Schema.Types.ObjectId, ref: 'Hotel'}]
})

module.exports = mongoose.model('User', UserSchema)