"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const database_1 = __importDefault(require("../database"));
const pg_format_1 = __importDefault(require("pg-format"));
class OrderStore {
    // Create a new order
    async create(o) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("INSERT INTO orders (user_id, status) VALUES (%L, %L) RETURNING *", o.user_id, o.status);
            const result = await conn.query(sql);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not add new order ${o.id}. Error: ${err}`);
        }
    }
    // Update an order
    async update(o) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("UPDATE orders SET status = %L WHERE id = %L RETURNING *", o.status, o.id);
            const result = await conn.query(sql);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not update order ${o.id}. Error: ${err}`);
        }
    }
    // Check that order has active status (not completed), then add product to order
    async addProductToOrder(op) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("SELECT * FROM orders WHERE id = %L AND status = 'active'", op.orderId);
            const result = await conn.query(sql);
            if (result.rows.length === 0) {
                throw new Error(`Order ${op.orderId} is not active`);
            }
            const sql2 = (0, pg_format_1.default)(`INSERT INTO order_products ("orderId", "productId", quantity) VALUES (%L, %L, %L) RETURNING *`, op.orderId, op.productId, op.quantity);
            const result2 = await conn.query(sql2);
            const orderProduct = result2.rows[0];
            conn.release();
            return orderProduct;
        }
        catch (err) {
            throw new Error(`Could not add product ${op.productId} to order ${op.orderId}. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM orders WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not delete order ${id}. Error: ${err}`);
        }
    }
    ;
    async currentOrderByUser(userId) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("SELECT * FROM orders WHERE user_id = %L AND status = 'active'", userId);
            const result = await conn.query(sql);
            if (result.rows.length === 0) {
                throw new Error(`No current order for user ${userId} found`);
            }
            const order = result.rows[0];
            return order;
        }
        catch (err) {
            throw new Error(`Cannot get current order: ${err}`);
        }
    }
    async completedOrdersByUser(userId) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("SELECT * FROM orders WHERE user_id = %L AND status = 'completed'", userId);
            const result = await conn.query(sql);
            if (result.rows.length === 0) {
                throw new Error(`No completed orders for user ${userId} found`);
            }
            const order = result.rows;
            return order;
        }
        catch (err) {
            throw new Error(`Cannot get completed orders: ${err}`);
        }
    }
}
exports.OrderStore = OrderStore;
