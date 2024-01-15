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
    const { limit, page, tagId = undefined } = req.query;
    res.status(200).json(
      await service.list({
        limit: Number(limit),
        page: Number(page),
        tagId: Number(tagId),
      })
    );
  } catch (error) {
    next(error);
  }
}


export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.update(req.params.tagId, req.body));
  } catch (error) {
    next(error);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.destroy(req.params.tagId));
  } catch (error) {
    next(error);
  }
}

export async function listTagProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { limit, page } = req.query;
    res
      .status(200)
      .json(
        await service.listTagProducts(
          req.params.slug,
          Number(limit),
          Number(page)
        )
      );
  } catch (error) {
    next(error);
  }
}

export default { list, create, update, destroy, listTagProducts };
