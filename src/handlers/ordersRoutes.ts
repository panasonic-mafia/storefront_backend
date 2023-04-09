// An API routes for orders as per REQIREMENTS.md
import {Order, OrderStore} from '../models/orders';
import { Request, Response, NextFunction, Application } from "express";
import AppError from "../errors/AppError";
import authorizeJWT from "../middlewares/authorizeJWT";

const store = new OrderStore();

const create = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const order: Order = {
      user_id: _req.body.user_id,
      status: _req.body.status
    }
    const newOrder = await store.create(order);
    res.status(200).json({
      statusCode: 200,
      message: 'order created successfully',
      data: newOrder
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}


const update = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const order: Order = {
      id: _req.body.id,
      user_id: _req.body.user_id,
      status: _req.body.status
    }
    const updatedOrder = await store.update(order);
    res.status(200).json({
      statusCode: 200,
      message: 'order updated successfully',
      data: updatedOrder
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}


const destroy = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedOrder = await store.delete(_req.params.id);
    res.status(200).json({
      statusCode: 200,
      message: 'order deleted successfully',
      data: deletedOrder
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}

const currentOrderByUser = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await store.currentOrderByUser(_req.params.id);
    res.status(200).json({
      statusCode: 200,
      message: 'current order fetched successfully',
      data: order
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}

const completedOrdersByUser = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await store.completedOrdersByUser(_req.params.id);
    res.status(200).json({
      statusCode: 200,
      message: 'completed orders fetched successfully',
      data: orders
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}

const ordersRoutes = (app: Application) => {
  app.post('orders', authorizeJWT, create);
  app.put('orders', authorizeJWT, update);
  app.delete('orders/:id', authorizeJWT, destroy);
  app.get('users/:id/orders/current', authorizeJWT, currentOrderByUser);
  app.get('users/:id/orders/completed', authorizeJWT, completedOrdersByUser);
}

export default ordersRoutes;





