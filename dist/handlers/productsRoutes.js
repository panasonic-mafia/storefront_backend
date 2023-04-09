"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// A product roures as per REQIREMENTS.md
const products_1 = require("../models/products");
const AppError_1 = __importDefault(require("../errors/AppError"));
const authorizeJWT_1 = __importDefault(require("../middlewares/authorizeJWT"));
const store = new products_1.ProductStore();
const index = async (_req, res, next) => {
    try {
        const products = await store.index();
        res.status(200).json({
            statusCode: 200,
            message: 'products fetched successfully',
            data: products
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const show = async (req, res, next) => {
    try {
        const product = await store.show(req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: 'product fetched successfully',
            data: product
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const create = async (req, res, next) => {
    try {
        const newProduct = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        };
        const createdProduct = await store.create(newProduct);
        res.status(200).json({
            statusCode: 200,
            message: 'product is created successfully',
            data: createdProduct
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const destroy = async (req, res, next) => {
    try {
        const deletedProduct = await store.delete(req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: 'product is deleted successfully',
            data: deletedProduct
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const update = async (req, res, next) => {
    try {
        const updatedProduct = await store.update(req.body);
        res.status(200).json({
            statusCode: 200,
            message: 'product is updated successfully',
            data: updatedProduct
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const top = async (req, res, next) => {
    try {
        const topProducts = await store.top();
        res.status(200).json({
            statusCode: 200,
            message: 'top products fetched successfully',
            data: topProducts
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const byCategory = async (req, res, next) => {
    try {
        const products = await store.byCategory(req.params.category);
        res.status(200).json({
            statusCode: 200,
            message: 'products fetched successfully',
            data: products
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const productsRoutes = (app) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', authorizeJWT_1.default, create);
    app.patch('/products', authorizeJWT_1.default, update);
    app.get('/products/top', top);
    app.get('/products/category/:category', byCategory);
    app.delete('/products/:id', authorizeJWT_1.default, destroy);
};
exports.default = productsRoutes;
