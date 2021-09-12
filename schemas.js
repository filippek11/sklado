const Joi = require('joi');

module.exports.productSchema = Joi.object({
	product: Joi.object({
		barcode: Joi.string().required().min(13).max(13),
		name: Joi.string().required(),
		quantity: Joi.number().required().min(0)
	}).required()
});

module.exports.productQuantitySchema = Joi.object({
	product: Joi.object({
		quantity: Joi.number().required().min(0)
	}).required()
});
