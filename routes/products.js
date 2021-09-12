const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { productSchema, productQuantitySchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Product = require('../models/product');

const validateProduct = (req, res, next) => {
	const { error } = productSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

const validateProductQuantity = (req, res, next) => {
	const { error } = productQuantitySchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

// index page
router.get(
	'/',
	catchAsync(async (req, res, next) => {
		const { barcode } = req.query;
		if (barcode) {
			const products = await Product.find({ barcode });
			res.render('index', { products, barcode });
		} else {
			const products = await Product.find({});
			res.render('index', { products, barcode });
		}
	})
);

// new product page
router.get('/new', (req, res) => {
	res.render('new');
});

// making a new product
router.post(
	'/',
	validateProduct,
	catchAsync(async (req, res, next) => {
		// if (!req.body.product) throw new ExpressError('Invalid Campground Data', 400);
		const product = new Product(req.body.product);
		await product.save();
		req.flash('success', 'New product added successfully!');
		res.redirect('products');
	})
);

// single product display

// details page
router.get(
	'/:id',
	catchAsync(async (req, res, next) => {
		const product = await Product.findById(req.params.id);
		if (!product) {
			req.flash('error', 'Product cannot be found!');
			return res.redirect('/products');
		}
		res.render('show', { product });
	})
);

// edit PUT request
router.put(
	'/:id',
	catchAsync(async (req, res, next) => {
		const { id } = req.params;
		const productQuantity = await Product.findById(req.params.id);
		const formQuantity = await req.body.product;
		const newQuantity = productQuantity.quantity + Number(formQuantity.quantity);
		if (newQuantity >= 0) {
			const product = await Product.findByIdAndUpdate(id, { $inc: { ...req.body.product } });
			req.flash('success', 'Product updated successfully!');
			res.redirect(`/products/${product._id}`);
		} else {
			req.flash('error', 'Product cannot be found!');
			return res.redirect(`/products/${product._id}`);
		}
	})
);

// delete request
router.delete(
	'/:id',
	catchAsync(async (req, res, next) => {
		const { id } = req.params;
		await Product.findByIdAndDelete(id);
		req.flash('success', 'Product deleted successfully!');
		res.redirect('/products');
	})
);

module.exports = router;
