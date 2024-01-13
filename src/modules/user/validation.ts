import Joi from "joi";
import { ROLES } from "../../utils/constants";

export default {
  create: {
    body: {
      schema: Joi.object({
        firstname: Joi.string().trim().max(50).required().lowercase(),
        surname: Joi.string().trim().max(50).required().lowercase(),
        email: Joi.string().trim().email().lowercase().required(),
        phoneNumber: Joi.string().trim().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.any()
          .equal(Joi.ref("password"))
          .required()
          .label("Confirm password")
          .messages({ "any.only": "{{#label}} does not match" }),
        role: Joi.string()
          .valid(...Object.values(ROLES))
          .default(ROLES.USER),
      }),
    },
  },

  login: {
    body: {
      schema: Joi.object({
        email: Joi.string().trim().email().required().lowercase(),
        password: Joi.string().trim().required(),
      }),
    },
  },

  update: {
    body: {
      schema: Joi.object({
        firstname: Joi.string().trim().max(50).lowercase(),
        surname: Joi.string().max(50).trim().lowercase(),
        phoneNumber: Joi.string().max(15).trim(),
      }).or("firstname", "surname", "phoneNumber"),
    },
  },

  listUsers: {
    query: {
      schema: Joi.object({
        limit: Joi.number().integer().default(30),
        page: Joi.number().integer().default(1),
      }),
    },
  },

  changePassword: {
    body: {
      schema: Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
        confirmNewPassword: Joi.any()
          .equal(Joi.ref("newPassword"))
          .required()
          .label("Confirm new password")
          .messages({ "any.only": "{{#label}} does not match" }),
      }),
    },
  },

  remove: {
    params: {
      schema: Joi.object({
        userId: Joi.string().trim().required(),
      }),
    },
  },

  view: {
    params: {
      schema: Joi.object({
        userId: Joi.string().trim().required(),
      }),
    },
  },
};
