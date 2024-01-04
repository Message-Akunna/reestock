import { NextFunction, Request, Response } from "express";
//
import { ListParamsInt } from "../../utils/interface";
import service from "./service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.create(req.body));
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.login(req.body));
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, ...data } = req.body;
    res.status(200).json(await service.update(userId, data));
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20 } = req.query as unknown as ListParamsInt;
    res.status(200).json(await service.list({ limit, page }));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    res.status(200).json(await service.remove(userId));
  } catch (error) {
    next(error);
  }
}

export async function view(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    res.status(200).json(await service.view(userId));
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, ...data } = req.body;
    res.status(200).json(await service.changePassword(userId, data));
  } catch (error) {
    next(error);
  }
}

export default {
  list,
  view,
  login,
  create,
  remove,
  update,
  changePassword,
};
