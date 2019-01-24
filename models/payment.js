const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	amount: Number,
	method: String,
	order: mongoose.Schema.Types.ObjectId,
    created_at: Date,
    updated_at: Date
})

schema.pre('save', function (next) {
	var now = new Date();
	this.updated_at = now;
	if (!this.created_at) {
		this.created_at = now;
	}
	next();
})


const Payment = module.exports = mongoose.model('Payment', schema)
