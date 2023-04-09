"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../models/users");
const AppError_1 = __importDefault(require("../errors/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorizeJWT_1 = __importDefault(require("../middlewares/authorizeJWT"));
const store = new users_1.UserStore();
const tokenSecret = process.env.TOKEN_SECRET;
const index = async (_req, res, next) => {
    try {
        const users = await store.index();
        res.status(200).json({
            statusCode: 200,
            message: 'users fetched successfully',
            data: users
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const create = async (req, res, next) => {
    try {
        const newUser = {
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };
        const createdUser = await store.create(newUser);
        const token = jsonwebtoken_1.default.sign({ user: createdUser }, tokenSecret);
        res.status(200).json({
            statusCode: 200,
            message: 'user is created successfully',
            data: {
                user: createdUser,
                token: token
            }
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const authenticate = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await store.authenticate(username, password);
        if (user) {
            const token = jsonwebtoken_1.default.sign({ user: user }, tokenSecret);
            res.status(200).json({
                statusCode: 200,
                message: 'Authenticated successfully',
                data: {
                    token: token
                }
            });
        }
        else {
            throw new Error('Authentication failed');
        }
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const show = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await store.show(userId);
        res.status(200).json({
            statusCode: 200,
            message: 'user is fetched successfully',
            data: user
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const deleteById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const deletedUser = await store.delete(userId);
        res.status(200).json({
            statusCode: 200,
            message: 'user is deleted successfully',
            data: deletedUser
        });
    }
    catch (err) {
        next(new AppError_1.default(500, `${err}`));
    }
};
const userRoutes = (app) => {
    app.get('/users', authorizeJWT_1.default, index);
    app.post('/users', create);
    app.get('/users/:id', authorizeJWT_1.default, show);
    app.post('/users/authenticate', authenticate);
    app.delete('/users/:id', authorizeJWT_1.default, deleteById);
};
exports.default = userRoutes;
