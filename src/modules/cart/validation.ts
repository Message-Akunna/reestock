import Joi from "joi";

export default {
  create: {
    body: {
      schema: Joi.object({
        productId: Joi.number().required(),
        quantity: Joi.number().integer().default(1).required(),
      }),
    },
  },

  remove: {
    params: {
      schema: Joi.object({
        cartItemId: Joi.string().required(),
      }),
    },
  },

  update: {
    params: {
      schema: Joi.object({
        cartId: Joi.string().required(),
      }),
    },

    body: {
      schema: Joi.object({
        quantity: Joi.number().integer(),
      }),
    },
  },
};
