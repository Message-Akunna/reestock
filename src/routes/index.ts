import { Express, Request, Response, NextFunction } from "express";
import { errorMessage } from "iyasunday";
//
import UserEndpoint from "../modules/user";
import { CustomError } from "../utils/interface";

export default (app: Express) => {
  const apiVersion = "/v1";
  //
  app.use(apiVersion, UserEndpoint);

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
