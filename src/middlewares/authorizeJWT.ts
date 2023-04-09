import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const tokenSecret: string = process.env.TOKEN_SECRET as string;

const authorizeJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader: string = req.headers.authorization as string;
    if (authorizationHeader) {
      const token = authorizationHeader.split(" ")[1];
      jwt.verify(token, tokenSecret);
      next();
    } else {
      throw new Error("Token is missing in authorization header");
    }
  } catch (err) {
    res.status(401).json({
      statusCode: 401,
      message: `Authorization error: ${err}`,
      data: {},
    });
  }
};

export default authorizeJWT;
