import Joi from "joi";

export default {
  remove: {
    body: {
      schema: Joi.object({
        fileUrl: Joi.alt([
          Joi.array().items(Joi.string()),
          Joi.string(),
        ]).required(),
        throwError: Joi.bool().default(true),
      }),
    },
  },
};
