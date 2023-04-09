// A product roures as per REQIREMENTS.md
import {Product, ProductStore} from '../models/products';
import { Request, Response, NextFunction, Application } from "express";
import AppError from "../errors/AppError";
import authorizeJWT from "../middlewares/authorizeJWT";

const store = new ProductStore();

const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await store.index();
    res.status(200).json({
      statusCode: 200,
      message: 'products fetched successfully',
      data: products
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await store.show(req.params.id);
    res.status(200).json({
      statusCode: 200,
      message: 'product fetched successfully',
      data: product
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newProduct: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };
    const createdProduct = await store.create(newProduct);
    res.status(200).json({
      statusCode: 200,
      message: 'product is created successfully',
      data: createdProduct
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedProduct = await store.delete(req.params.id);
    res.status(200).json({
      statusCode: 200,
      message: 'product is deleted successfully',
      data: deletedProduct
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedProduct = await store.update(req.body);
    res.status(200).json({
      statusCode: 200,
      message: 'product is updated successfully',
      data: updatedProduct
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}

const top = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topProducts = await store.top();
    res.status(200).json({
      statusCode: 200,
      message: 'top products fetched successfully',
      data: topProducts
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}

const byCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await store.byCategory(req.params.category);
    res.status(200).json({
      statusCode: 200,
      message: 'products fetched successfully',
      data: products
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}


const productsRoutes = (app: Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', authorizeJWT, create);
  app.patch('/products', authorizeJWT, update);
  app.get('/products/top', top);
  app.get('/products/category/:category', byCategory)
  app.delete('/products/:id', authorizeJWT, destroy);
}

export default productsRoutes;