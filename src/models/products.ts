import client from "../database";
import format from "pg-format";
// A CRUD model for products as per REQIREMENTS.md

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
  };

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products;";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products: ${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = format("SELECT * FROM products WHERE id = %L", id);
      const result = await conn.query(sql);
      if (result.rows.length === 0) {
        throw new Error(`No product with id ${id} found`)
      }
      const product = result.rows[0];
      return product;
    } catch (err) {
      throw new Error(`Cannot get product: ${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = format(
        "INSERT INTO products (name, price, category) VALUES (%L) RETURNING *",
        [p.name, p.price, p.category]
      );
      const result = await conn.query(sql);
      const newProduct = result.rows[0];
      conn.release();
      return newProduct;
    } catch (err) {
      throw new Error(`Cannot create product: ${err}`);
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = format("DELETE FROM products WHERE id = %L RETURNING *", id);
      const result = await conn.query(sql);
      if (result.rows.length === 0) {
        throw new Error(`No product with id ${id} found`)
      }
      const product = result.rows[0];
      return product;
    } catch (err) {
      throw new Error(`Cannot delete product: ${err}`);
    }
  }

  async update(p: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = format(
        "UPDATE products SET name = %L, price = %L, category = %L WHERE id = %L RETURNING *",
        p.name, p.price, p.category, p.id
      );
      const result = await conn.query(sql);
      if (result.rows.length === 0) {
        throw new Error(`No product with id ${p.id} found`)
      }
      const product = result.rows[0];
      return product;
    } catch (err) {
      throw new Error(`Cannot update product: ${err}`);
    }
  }

  // Get top most 5 popular products
  async top(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products ORDER BY id DESC LIMIT 5;";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products: ${err}`);
    }}
  
  
  // Get products by category
  async byCategory(category: string): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = format("SELECT * FROM products WHERE category = %L;", category);
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products: ${err}`);
    }
  }
}
