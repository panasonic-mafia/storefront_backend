import {User, UserStore} from "../models/users";
import { Request, Response, Application, NextFunction } from "express";
import AppError from "../errors/AppError";
import jwt from 'jsonwebtoken';
import authorizeJWT from "../middlewares/authorizeJWT";

const store = new UserStore();

const tokenSecret: string = process.env.TOKEN_SECRET as string;

const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await store.index();
    res.status(200).json({
      statusCode: 200,
      message: 'users fetched successfully',
      data: users
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser: User = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };
    const createdUser = await store.create(newUser);
    const token = jwt.sign({user: createdUser}, tokenSecret)
    res.status(200).json({
      statusCode: 200,
      message: 'user is created successfully',
      data: {
        user: createdUser,
        token: token
      }
    })
  } catch (err) {
    next(new AppError(500, `${err}`));
  }
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {username, password} = req.body;
    const user = await store.authenticate(username, password);
    if (user) {
      const token = jwt.sign({user: user}, tokenSecret);
      res.status(200).json({
        statusCode: 200,
        message: 'Authenticated successfully',
        data: {
          token: token
        }
      })
    } else {
      throw new Error('Authentication failed')
    }
  } catch (err) {
    next(new AppError(500, `${err}`))
  }
}

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: string = req.params.id;
    const user = await store.show(userId);
    res.status(200).json({
      statusCode: 200,
      message: 'user is fetched successfully',
      data: user
    })
  } catch (err) {
    next(new AppError(500, `${err}`))
  }
}

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: string = req.params.id;
    const deletedUser = await store.delete(userId);
    res.status(200).json({
      statusCode: 200,
      message: 'user is deleted successfully',
      data: deletedUser
    })
  } catch (err) {
    next(new AppError(500, `${err}`))
  }
}

const userRoutes = (app: Application) => {
  app.get('/users', authorizeJWT, index);
  app.post('/users', create);
  app.get('/users/:id', authorizeJWT, show);
  app.post('/users/authenticate', authenticate);
  app.delete('/users/:id', authorizeJWT, deleteById);
}

export default userRoutes;