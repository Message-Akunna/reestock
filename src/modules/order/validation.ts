import Joi from "joi";
import { DELIVERY_TYPES, ORDER_STATUS } from "../../utils/constants";

export default {
  create: {
    body: {
      schema: Joi.object({
        phoneNumber: Joi.string().trim().max(15).required(),
        country: Joi.string().trim(),
        city: Joi.string().trim(),
        address: Joi.string().trim().required(),
        shippingType: Joi.string(),
        transactionRef: Joi.string().uuid().required().messages({
          "any.required": `transactionRef is required`,
          "any.empty": `transactionRef cannot be empty`,
        }),
      }),
    },
  },

  list: {
    query: {
      schema: Joi.object({
        status: Joi.string().valid(...Object.values(ORDER_STATUS)),
        page: Joi.number().default(1),
        limit: Joi.number().default(20),
      }),
    },
  },

  listAllOrdersAdmin: {
    query: {
      schema: Joi.object({
        limit: Joi.number().integer().default(30),
        page: Joi.number().integer().default(1),
      }),
    },
  },

  view: {
    params: {
      schema: Joi.object({
        orderId: Joi.string().required(),
      }),
    },
  },

  update: {
    params: {
      schema: Joi.object({
        orderId: Joi.string().required(),
      }),
    },

    body: {
      schema: Joi.object({
        status: Joi.string(),
        phoneNumber: Joi.string().trim().max(15),
        country: Joi.string().trim(),
        city: Joi.string().trim(),
        address: Joi.string().trim(),
        shippingType: Joi.string(),
      }),
    },
  },
};
