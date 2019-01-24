const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: 'string',
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


const Category = module.exports = mongoose.model('Category', schema)
