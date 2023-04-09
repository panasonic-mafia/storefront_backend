"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
const pg_format_1 = __importDefault(require("pg-format"));
class ProductStore {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM products;";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products: ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("SELECT * FROM products WHERE id = %L", id);
            const result = await conn.query(sql);
            if (result.rows.length === 0) {
                throw new Error(`No product with id ${id} found`);
            }
            const product = result.rows[0];
            return product;
        }
        catch (err) {
            throw new Error(`Cannot get product: ${err}`);
        }
    }
    async create(p) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("INSERT INTO products (name, price, category) VALUES (%L) RETURNING *", [p.name, p.price, p.category]);
            const result = await conn.query(sql);
            const newProduct = result.rows[0];
            conn.release();
            return newProduct;
        }
        catch (err) {
            throw new Error(`Cannot create product: ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("DELETE FROM products WHERE id = %L RETURNING *", id);
            const result = await conn.query(sql);
            if (result.rows.length === 0) {
                throw new Error(`No product with id ${id} found`);
            }
            const product = result.rows[0];
            return product;
        }
        catch (err) {
            throw new Error(`Cannot delete product: ${err}`);
        }
    }
    async update(p) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("UPDATE products SET name = %L, price = %L, category = %L WHERE id = %L RETURNING *", p.name, p.price, p.category, p.id);
            const result = await conn.query(sql);
            if (result.rows.length === 0) {
                throw new Error(`No product with id ${p.id} found`);
            }
            const product = result.rows[0];
            return product;
        }
        catch (err) {
            throw new Error(`Cannot update product: ${err}`);
        }
    }
    // Get top most 5 popular products
    async top() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM products ORDER BY id DESC LIMIT 5;";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products: ${err}`);
        }
    }
    // Get products by category
    async byCategory(category) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("SELECT * FROM products WHERE category = %L;", category);
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
