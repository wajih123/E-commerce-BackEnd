const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    products: [{
        product_id: mongoose.Schema.Types.ObjectId,
        quantity: Number
    }],
    total_amount: Number,
	created_by: mongoose.Schema.Types.ObjectId,
    created_at: Date,
    updated_at: Date,
    prints: [{
        operator_id: mongoose.Schema.Types.ObjectId,
        printed_at: Date
    }]
})

schema.pre('save', function (next) {
	var now = new Date();
	this.updated_at = now;
	if (!this.created_at) {
		this.created_at = now;
	}
	next();
})


const Order = module.exports = mongoose.model('Order', schema)
