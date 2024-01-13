import { NextFunction, Request, Response } from "express";
//
import services from "./service";
import { ListParamsInt, SearchParamsInt } from "../../utils/interface";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await services.create(req.user, req.body));
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await services.list(req.query));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId } = req.params;
    res.status(200).json(await services.remove(productId));
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId } = req.params;
    res.status(200).json(await services.update(productId, req.body));
  } catch (error) {
    next(error);
  }
}

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      limit,
      page,
      phrase = undefined,
      maxPrice = undefined,
      minPrice = undefined,
    } = req.query as SearchParamsInt;
    res.status(200).json(
      await services.search({
        limit,
        page,
        phrase,
        maxPrice,
        minPrice,
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function view(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const { showRelatedProducts } = req.query;
    res
      .status(200)
      .json(await services.singleProduct(slug, Boolean(showRelatedProducts)));
  } catch (error) {
    next(error);
  }
}

export default { list, view, remove, create, update, search };
