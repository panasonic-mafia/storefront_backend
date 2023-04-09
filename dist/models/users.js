"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const pg_format_1 = __importDefault(require("pg-format"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//@ts-ignore
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const pepper = process.env.BYCRYPT_PASSWORD;
class UserStore {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM users;";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get users: ${err}`);
        }
    }
    async create(user) {
        try {
            const conn = await database_1.default.connect();
            //@ts-ignore
            const hash = bcrypt_1.default.hashSync(user.password + pepper, saltRounds);
            const sql = (0, pg_format_1.default)("INSERT INTO users (username, \"firstName\", \"lastName\", password_digest) VALUES (%L) RETURNING *", [user.username, user.firstName, user.lastName, hash]);
            const result = await conn.query(sql);
            const newUser = result.rows[0];
            conn.release();
            return newUser;
        }
        catch (err) {
            throw new Error(`Cannot create user: ${err}`);
        }
    }
    async delete(id) {
        const conn = await database_1.default.connect();
        try {
            // check if user exists
            const sql1 = (0, pg_format_1.default)("SELECT * FROM users WHERE id = %L", id);
            const result1 = await conn.query(sql1);
            if (result1.rows.length === 0) {
                throw new Error(`No user with id ${id} found`);
            }
            // delete user
            const sql2 = (0, pg_format_1.default)("DELETE FROM users WHERE id = %L RETURNING *", id);
            const result = await conn.query(sql2);
            const user = result.rows[0];
            console.log(`User to delete ----> ${user}`);
            conn.release();
            return user;
        }
        catch (err) {
            conn.release();
            throw new Error(`Cannot delete user: ${err}`);
        }
    }
    async show(userId) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("SELECT * FROM users WHERE id = %L", userId);
            const result = await conn.query(sql);
            if (result.rows.length === 0) {
                throw new Error(`No user with id ${userId} found`);
            }
            const user = result.rows[0];
            return user;
        }
        catch (err) {
            throw new Error(`Cannot get user: ${err}`);
        }
    }
    async showByUsername(username) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("SELECT * FROM users WHERE username = %L", username);
            const result = await conn.query(sql);
            if (result.rows.length === 0) {
                throw new Error(`No user with username ${username} does not exist`);
            }
            const user = result.rows[0];
            return user;
        }
        catch (err) {
            throw new Error(`Cannot get user: ${err}`);
        }
    }
    async authenticate(username, password) {
        try {
            const conn = await database_1.default.connect();
            const sql = (0, pg_format_1.default)("SELECT * FROM users where username = %L", username);
            const result = await conn.query(sql);
            if (result.rowCount) {
                const user = result.rows[0];
                if (bcrypt_1.default.compareSync(password + pepper, user.password_digest)) {
                    return user;
                }
            }
            return null;
        }
        catch (err) {
            throw new Error(`Cannot authenticate: ${err}`);
        }
    }
}
exports.UserStore = UserStore;
