"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const usersRoutes_1 = __importDefault(require("./handlers/usersRoutes"));
const errorHadler_1 = __importDefault(require("./middlewares/errorHadler"));
const productsRoutes_1 = __importDefault(require("./handlers/productsRoutes"));
const ordersRoutes_1 = __importDefault(require("./handlers/ordersRoutes"));
const app = (0, express_1.default)();
const address = "0.0.0.0:3000";
app.use(body_parser_1.default.json());
//use helmet
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    res.send('Hello World!');
});
(0, usersRoutes_1.default)(app);
(0, productsRoutes_1.default)(app);
(0, ordersRoutes_1.default)(app);
app.use(errorHadler_1.default);
app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
exports.default = app;
