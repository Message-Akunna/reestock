import { Request, Response, NextFunction } from "express";
import service from "./service";

export async function addToCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id as string;
    res.status(200).json(await service.addToCart(userId, req.body));
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id as string;
    res.status(200).json(await service.list(userId));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { cartItemId } = req.params;
    res.status(200).json(await service.remove(Number(cartItemId)));
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { cartId } = req.params;
    res.status(200).json(await service.update(Number(cartId), req.body));
  } catch (error) {
    next(error);
  }
}

export async function emptyCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id as string;
    res.status(200).json(await service.emptyCart(userId));
  } catch (error) {
    next(error);
  }
}

export default { addToCart, list, remove, update, emptyCart };
