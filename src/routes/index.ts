import { Express, Request, Response, NextFunction } from "express";
import { errorMessage } from "iyasunday";
// modules
import TagEndpoint from "../modules/tag";
import UserEndpoint from "../modules/user";
import CartEndpoint from "../modules/cart";
import ProductEndpoint from "../modules/product";
import CategoryEndpoint from "../modules/category";
import fileManagerEndpoints from "../modules/file";
// interfaces and config
import { CustomError } from "../utils/interface";

export default (app: Express) => {
  const apiVersion = "/v1";
  //
  app.use(apiVersion, TagEndpoint);
  app.use(apiVersion, UserEndpoint);
  app.use(apiVersion, CartEndpoint); 
  app.use(apiVersion, ProductEndpoint);
  app.use(apiVersion, CategoryEndpoint);
  app.use(apiVersion, fileManagerEndpoints);

  //
  app.use(
    (err: CustomError, req: Request, res: Response, next: NextFunction) => {
      if (!err) return next();
      res.status(err.httpStatusCode || 500).json(errorMessage(err));
    }
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
      message: `Requested route ( ${req.get("HOST")}${
        req.originalUrl
      } ) not found`,
    });
  });
};
