"use strict";
import { Router } from "express";
import { joiValidator } from "iyasunday";
//
import controller from "./controller";
import validation from "./validation";
import { guard, adminGuard } from "../../utils/middleware";

const route = Router();

route.post(
  "/user/register",
  joiValidator(validation.create),
  controller.create
);
route.post("/user/login", joiValidator(validation.login), controller.login);
route.patch(
  "/user/update",
  guard(),
  joiValidator(validation.update),
  controller.update
);
route.patch(
  "/user/change-password",
  guard(),
  joiValidator(validation.changePassword),
  controller.changePassword
);

// admin route
route.delete(
  "/user/:userId",
  joiValidator(validation.remove),
  adminGuard(),
  controller.remove
);

route.get(
  "/user/:userId",
  joiValidator(validation.view),
  adminGuard(),
  controller.view
);
route.get(
  "/users/list",
  joiValidator(validation.listUsers),
  adminGuard(),
  controller.list
);

export default route;
