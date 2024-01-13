"use strict";
import { Router } from "express";
import { joiValidator } from "iyasunday";
// 
import validation from "./validation";
import controller from "./controller";
import { adminGuard, guard } from "../../utils/middleware";

const route = Router();

route.post(
  "/category",
  adminGuard(),
  joiValidator(validation.create),
  controller.create
);

route.get("/categories", joiValidator(validation.list), controller.list);
route.get(
  "/categories/all",
  adminGuard(),
  joiValidator(validation.listAll),
  controller.listAll
);

route.patch(
  "/category/:categoryId",
  adminGuard(),
  joiValidator(validation.update),
  controller.update
);
route.delete(
  "/category/:categoryId",
  adminGuard(),
  joiValidator(validation.destroy),
  controller.destroy
);

route.get(
  "/category/:slug/products",
  joiValidator(validation.listCategoryProducts),
  controller.listCategoryProducts
);

export default route;
