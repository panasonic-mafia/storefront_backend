"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  A custom error handler middleware
 *  Inspired by: Inspired by: https://www.smashingmagazine.com/2020/08/error-handling-nodejs-error-classes/
 * @param err - error
 * @param req - express request
 * @param res - express response
 * @param next - express next
 */
const errorHandler = (err, req, res, next) => {
    try {
        const status = err.status || 500;
        const msg = err.message || "";
        res.status(status).json({
            statusCode: status,
            message: msg,
            data: {}
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = errorHandler;
