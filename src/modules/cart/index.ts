import { Router } from "express";
import { joiValidator } from "iyasunday";
//
import controller from "./controller";
import validation from "./validation";
import { guard } from "../../utils/middleware";

const route = Router();

route.post(
  "/cart",
  guard(),
  joiValidator(validation.create),
  controller.addToCart
);

route.patch(
  "/cart/:cartId",
  joiValidator(validation.update),
  guard(),
  controller.update
);

route.get("/cart", guard(), controller.list);

route.delete( 
  "/cart/:cartItemId",
  joiValidator(validation.remove),
  guard(),
  controller.remove
);


route.delete("/cart", guard(), controller.emptyCart);

export default route;
