"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenSecret = process.env.TOKEN_SECRET;
const authorizeJWT = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            const token = authorizationHeader.split(" ")[1];
            jsonwebtoken_1.default.verify(token, tokenSecret);
            next();
        }
        else {
            throw new Error("Token is missing in authorization header");
        }
    }
    catch (err) {
        res.status(401).json({
            statusCode: 401,
            message: `Authorization error: ${err}`,
            data: {},
        });
    }
};
exports.default = authorizeJWT;
