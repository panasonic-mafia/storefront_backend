import client from "../database";
import format from "pg-format";
// A model for orders as per REQIREMENTS.md

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export type OrderProduct = {
  id?: number;
  orderId: number;
  productId: number;
  quantity: number;
};


export class OrderStore {
  
  // Create a new order
  async create(o: Order): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = format(
        "INSERT INTO orders (user_id, status) VALUES (%L, %L) RETURNING *",
        o.user_id,
        o.status
      );
      const result = await conn.query(sql);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not add new order ${o.id}. Error: ${err}`);
    }
  }

  // Update an order
  async update(o: Order): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = format(
        "UPDATE orders SET status = %L WHERE id = %L RETURNING *",
        o.status,
        o.id
      );
      const result = await conn.query(sql);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not update order ${o.id}. Error: ${err}`);
    }
  }

  // Check that order has active status (not completed), then add product to order
  async addProductToOrder(op: OrderProduct): Promise<OrderProduct> {
    try {
      const conn = await client.connect();
      const sql = format(
        "SELECT * FROM orders WHERE id = %L AND status = 'active'",
        op.orderId
      );
      const result = await conn.query(sql);
      if (result.rows.length === 0) {
        throw new Error(`Order ${op.orderId} is not active`);
      }
      const sql2 = format(
        `INSERT INTO order_products ("orderId", "productId", quantity) VALUES (%L, %L, %L) RETURNING *`,
        op.orderId,
        op.productId,
        op.quantity
      );
      const result2 = await conn.query(sql2);
      const orderProduct = result2.rows[0];
      conn.release();
      return orderProduct;
    } catch (err) {
      throw new Error(
        `Could not add product ${op.productId} to order ${op.orderId}. Error: ${err}`
      );
    }
  }

   async delete (id: string): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  };

  async currentOrderByUser(userId: string): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = format(
        "SELECT * FROM orders WHERE user_id = %L AND status = 'active'",
        userId
      );
      const result = await conn.query(sql);
      if (result.rows.length === 0) {
        throw new Error(`No current order for user ${userId} found`);
      }
      const order = result.rows[0];
      return order;
    } catch (err) {
      throw new Error(`Cannot get current order: ${err}`);
    }
  }

  async completedOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = format(
        "SELECT * FROM orders WHERE user_id = %L AND status = 'completed'",
        userId
      );
      const result = await conn.query(sql);
      if (result.rows.length === 0) {
        throw new Error(`No completed orders for user ${userId} found`);
      }
      const order = result.rows;
      return order;
    } catch (err) {
      throw new Error(`Cannot get completed orders: ${err}`);
    }
  }
}