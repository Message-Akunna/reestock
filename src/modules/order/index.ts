import { Router } from "express";
import { joiValidator } from "iyasunday";
// 
import validation from "./validation";
import controller from "./controller";
import { adminGuard, guard } from "../../utils/middleware";

const route = Router();

route.post(
  "/order",
  joiValidator(validation.create),
  guard(),
  controller.create
);

route.get("/orders", guard(), joiValidator(validation.list), controller.list);

route.get(
  "/orders/list",
  adminGuard(),
  joiValidator(validation.listAllOrdersAdmin),
  controller.listAllOrders
);

route.get(
  "/order/:orderId",
  guard(),
  joiValidator(validation.view),
  controller.view
);

route.patch(
  "/order/:orderId",
  adminGuard(),
  joiValidator(validation.update),
  controller.update
);

export default route;
