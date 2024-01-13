import { Router } from "express";
import { joiValidator, uploadFile } from "iyasunday";
//
import controller from "./controller";
import validation from "./validation";
import { ALLOWED_IMAGE_FORMAT, FILE_LOCATION } from "../../utils/constants";

const route = Router();
const params = {
  location: FILE_LOCATION,
  allowedFormat: ALLOWED_IMAGE_FORMAT,
  limit: 0.5,
};
// 
route.post("/upload", uploadFile(params).any(), controller.create);
route.delete("/", joiValidator(validation.remove));

export default route;
