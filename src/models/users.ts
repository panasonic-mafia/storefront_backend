import client from "../database";
import format from "pg-format";
import bcrypt from "bcrypt";

export type User = {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  password?: string;
};

//@ts-ignore
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const pepper = process.env.BYCRYPT_PASSWORD;

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users;";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users: ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const conn = await client.connect();

      //@ts-ignore
      const hash = bcrypt.hashSync(user.password + pepper, saltRounds);
      const sql = format(
        "INSERT INTO users (username, \"firstName\", \"lastName\", password_digest) VALUES (%L) RETURNING *",
        [user.username, user.firstName, user.lastName, hash]
      );
      const result = await conn.query(sql);
      const newUser = result.rows[0];
      conn.release();
      return newUser;
    } catch (err) {
      throw new Error(`Cannot create user: ${err}`);
    }
  }
  
  async delete(id: string): Promise<User> {
    const conn = await client.connect();
    try {
      // check if user exists
      const sql1 = format("SELECT * FROM users WHERE id = %L", id);
      const result1 = await conn.query(sql1);
      if (result1.rows.length === 0) {
        throw new Error(`No user with id ${id} found`)
      }
      // delete user
      const sql2 = format("DELETE FROM users WHERE id = %L RETURNING *", id);
      const result = await conn.query(sql2);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      conn.release();
      throw new Error(`Cannot delete user: ${err}`);
    }
  }


  async show(userId: string): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = format("SELECT * FROM users WHERE id = %L", userId);
      const result = await conn.query(sql);
      if (result.rows.length === 0) {
        throw new Error(`No user with id ${userId} found`)
      }
      const user = result.rows[0];
      return user;
    } catch (err) {
      throw new Error(`Cannot get user: ${err}`);
    }
  }

  async showByUsername(username: string): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = format("SELECT * FROM users WHERE username = %L", username);
      const result = await conn.query(sql);
      if (result.rows.length === 0) {
        throw new Error(`No user with username ${username} does not exist`)
      }
      const user = result.rows[0];
      return user;
    } catch (err) {
      throw new Error(`Cannot get user: ${err}`);
    }
  }

  async authenticate(
    username: string,
    password: string
  ): Promise<User | null> {
    try {
      const conn = await client.connect();
      const sql = format("SELECT * FROM users where username = %L", username);
      const result = await conn.query(sql);
      if (result.rowCount) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password_digest)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`Cannot authenticate: ${err}`);
    }
  }
}
