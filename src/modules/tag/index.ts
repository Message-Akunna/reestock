"use strict";
import { Router } from "express";
import { joiValidator } from "iyasunday";
//
import validation from "./validation";
import controller from "./controller";
import { adminGuard, guard } from "../../utils/middleware";

const route = Router();

route.post(
  "/tag",
  adminGuard(),
  joiValidator(validation.create),
  controller.create
);

route.get(
  "/tags",
  adminGuard(),
  joiValidator(validation.list),
  controller.list
);
route.patch(
  "/tag/:tagId",
  adminGuard(),
  joiValidator(validation.update),
  controller.update
);
route.delete(
  "/tag/:tagId",
  adminGuard(),
  joiValidator(validation.destroy),
  controller.destroy
);

route.get(
  "/tag/:slug/products",
  joiValidator(validation.listTagProducts),
  controller.listTagProducts
);

export default route;
