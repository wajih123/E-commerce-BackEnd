const mongoose = require('mongoose')
const shortid = require('shortid')

const schema = new mongoose.Schema({
	name: String,
	token: String,
    created_at: Date,
	updated_at: Date,
	level: { type: String, default: 'OPERATOR' }
})

schema.pre('save', function (next) {
	var now = new Date();
	this.updated_at = now;
	if (!this.created_at) {
		this.created_at = now;
	}
	if (!this.token) {
		this.token = shortid.generate()
	}
	next();
})

schema.statics.isAdmin = function(token, callback) {
	if (typeof token === 'undefined' || !token) {
		return callback({message: 'Invalid token'})
	}
 	this.model('User').findOne({token}, (err, user) => {
		 console.log(user)
		if (err) {
			return callback({message: 'Invalid token'}) 
		}
		if (user.level !== 'ADMIN') {
			return callback(null, false)
		}
		return callback(null, user)
	})
}

schema.statics.checkToken = function(token, callback) {
	if (typeof token === 'undefined' || !token) {
		return callback({message: 'Invalid token'})
	}
	this.model('User').findOne({token}, callback)
}

const User = module.exports = mongoose.model('User', schema)
