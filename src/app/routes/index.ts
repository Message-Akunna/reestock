import { Express, Errback, NextFunction, Request, Response } from "express";
import { errorMessage } from "iyasunday";

export default (app: Express) => {
  const apiVersion = "v1";

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!err) return next();
  });
  
  app.use((req, res, next) => {
    res.status(404).json({
      message: `Requested route ( ${req.get("HOST")}${
        req.originalUrl
      } ) not found`,
    });
  });
};
