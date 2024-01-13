import Joi from "joi";

export default {
  create: {
    body: {
      schema: Joi.object({
        name: Joi.string().trim().max(30).required(),
        brandName: Joi.string().trim().max(30).required(),
        price: Joi.number().positive().required(),
        sku: Joi.string().trim().required(),
        reorderLevel: Joi.number().integer().required(),
        reorderQuantity: Joi.number().integer().required(),
        // imagesUrl: Joi.array().items(Joi.string()).required(),
        description: Joi.string().required(),
        categoryId: Joi.string().required(),
      }),
    },
  },

  listProducts: {
    query: {
      schema: Joi.object({
        limit: Joi.number().integer().default(20),
        page: Joi.number().integer().default(1),
      }),
    },
  },

  remove: {
    params: {
      schema: Joi.object({
        productId: Joi.string().required(),
      }),
    },
  },

  update: {
    body: {
      schema: Joi.object({
        name: Joi.string().trim().max(30),
        brandName: Joi.string().trim().max(30),
        manufacturingDate: Joi.string().trim(),
        expiryDate: Joi.string().trim(),
        // quantity: Joi.number().required(),
        price: Joi.number().positive(),
        sku: Joi.string().trim(),
        reorderLevel: Joi.string(),
        reorderQuantity: Joi.number().integer(),
        // imagesUrl: Joi.array().items(Joi.string()),
        description: Joi.string(),
        categoryId: Joi.string(),
      }),
    },

    params: {
      schema: Joi.object({
        productId: Joi.string().required(),
      }),
    },
  },

  search: {
    query: {
      schema: Joi.object({
        limit: Joi.number().integer().default(30),
        page: Joi.number().integer().default(1),
        phrase: Joi.string(),
        minPrice: Joi.number().integer().default(0),
        maxPrice: Joi.number().integer(),
      }),
    },
  },

  view: {
    params: {
      schema: Joi.object({
        slug: Joi.string().required(),
      }),
    },

    query: {
      schema: Joi.object({
        showRelatedProducts: Joi.boolean().default(false),
      }),
    },
  },
};
