import { NextFunction, Request, Response } from "express";
import {
  decodeJwt,
  errorMessage,
  InvalidTokenError,
  AuthenticationError,
} from "iyasunday";
//
import { ROLES } from "./constants";
import { CustomError } from "./interface";
import { getUserWithToken } from "../modules/user/service";

export const guard = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.headers.authorization;
      if (!token)
        throw new InvalidTokenError("Kindly provide authorization token");
      token = token.split(" ").pop() as string;

      const { tokenRef = undefined } = await decodeJwt(
        token,
        process.env.APP_KEY as string
      );

      if (!tokenRef) throw new InvalidTokenError("Invalid token supplied");
      const user = await getUserWithToken(tokenRef);
      req.user = user;

      return next();
    } catch (error) {
      res
        .status((error as CustomError).httpStatusCode || 500)
        .json(errorMessage(error));
    }
  };
};

export const adminGuard = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.headers.authorization;
      if (!token)
        throw new InvalidTokenError("Kindly provide authorization token");
      token = token.split(" ").pop() as string;

      const { tokenRef = undefined } = await decodeJwt(
        token,
        process.env.APP_KEY as string
      );

      if (!tokenRef) throw new InvalidTokenError("Invalid token supplied");
      const user = await getUserWithToken(tokenRef);
      if (user.role !== ROLES.ADMIN)
        throw new AuthenticationError("Permission denied");
      req.user = user;

      return next();
    } catch (error) {
      res
        .status((error as CustomError).httpStatusCode || 500)
        .json(errorMessage(error));
    }
  };
};

export default { guard, adminGuard };
