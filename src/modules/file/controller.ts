import { errorMessage } from "iyasunday";
import service from "./service";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "@/src/utils/interface";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.create(req.body, req.files));
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.remove(req.body));
  } catch (err) {
    next(err);
  }
}

export default { create, remove };
