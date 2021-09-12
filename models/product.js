const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	barcode: Number,
	name: String,
	quantity: Number
});

module.exports = mongoose.model('Product', ProductSchema);
