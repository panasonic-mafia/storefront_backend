"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// An API routes for orders as per REQIREMENTS.md
const orders_1 = require("../models/orders");
const AppError_1 = __importDefault(require("../errors/AppError"));
const authorizeJWT_1 = __importDefault(require("../middlewares/authorizeJWT"));
const store = new orders_1.OrderStore();
const create = async (_req, res, next) => {
    try {
        const order = {
            user_id: _req.body.user_id,
            status: _req.body.status
        };
        const newOrder = await store.create(order);
        res.status(200).json({
            statusCode: 200,
            message: 'order created successfully',
            data: newOrder
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const update = async (_req, res, next) => {
    try {
        const order = {
            id: _req.body.id,
            user_id: _req.body.user_id,
            status: _req.body.status
        };
        const updatedOrder = await store.update(order);
        res.status(200).json({
            statusCode: 200,
            message: 'order updated successfully',
            data: updatedOrder
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const destroy = async (_req, res, next) => {
    try {
        const deletedOrder = await store.delete(_req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: 'order deleted successfully',
            data: deletedOrder
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const currentOrderByUser = async (_req, res, next) => {
    try {
        const order = await store.currentOrderByUser(_req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: 'current order fetched successfully',
            data: order
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const completedOrdersByUser = async (_req, res, next) => {
    try {
        const orders = await store.completedOrdersByUser(_req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: 'completed orders fetched successfully',
            data: orders
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const ordersRoutes = (app) => {
    app.post('orders', authorizeJWT_1.default, create);
    app.put('orders', authorizeJWT_1.default, update);
    app.delete('orders/:id', authorizeJWT_1.default, destroy);
    app.get('users/:id/orders/current', authorizeJWT_1.default, currentOrderByUser);
    app.get('users/:id/orders/completed', authorizeJWT_1.default, completedOrdersByUser);
};
exports.default = ordersRoutes;
