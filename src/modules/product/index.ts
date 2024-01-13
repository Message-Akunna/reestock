import { Router } from "express";
import { joiValidator } from "iyasunday";
//
import validation from "./validation";
import controller from "./controller";
import { adminGuard, guard } from "../../utils/middleware";

const route = Router();

route.post(
  "/product",
  joiValidator(validation.create),
  adminGuard(),
  controller.create
);

route.get(
  "/products",
  joiValidator(validation.listProducts),
  adminGuard(),
  controller.list
);

route.get("/product/:slug", joiValidator(validation.view), controller.view);

route.patch(
  "/product/:productId",
  joiValidator(validation.update),
  adminGuard(),
  controller.update
);

route.get( 
  "/products/search",
  joiValidator(validation.search),
  controller.search
);

route.delete(
  "/product/:productId",
  joiValidator(validation.remove),
  adminGuard(),
  controller.remove
);


export default route;
