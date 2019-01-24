const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    available_stock: { type: Number, default: 0 },
    price: { type: Number, required: true },
    categories: [ mongoose.Schema.Types.ObjectId],
    created_by: mongoose.Schema.Types.ObjectId,
    created_at: Date,
    updated_at: Date
})

schema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
})

const Product = module.exports = mongoose.model('Product', schema)
