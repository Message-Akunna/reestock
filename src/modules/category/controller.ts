import { NextFunction, Request, Response } from "express";

import service from "./service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.create(req.body));
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit, page, categoryId = undefined } = req.query;
    res.status(200).json(
      await service.list({
        limit: Number(limit),
        page: Number(page),
        categoryId: Number(categoryId),
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function listAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit, page } = req.query;
    res.status(200).json(
      await service.listAll({
        limit: Number(limit),
        page: Number(page),
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.update(req.params.categoryId, req.body));
  } catch (error) {
    next(error);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.destroy(req.params.categoryId));
  } catch (error) {
    next(error);
  }
}

export async function listCategoryProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { limit, page } = req.query;
    res
      .status(200)
      .json(
        await service.listCategoryProducts(
          req.params.slug,
          Number(limit),
          Number(page)
        )
      );
  } catch (error) {
    next(error);
  }
}

export default { list, listAll, create, update, destroy, listCategoryProducts };
