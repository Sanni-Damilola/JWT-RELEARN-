import { NextFunction } from "express";
import Joi from "joi";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";

const validationSetUp = (
  schemaName: Joi.ObjectSchema,
  body: object,
  next: NextFunction
) => {
  const value = schemaName.validate(body, {
    allowUnknown: true,
    abortEarly: false,
    stripUnknown: true,
  });

  try {
    value.error
      ? next(
          new MainAppError({
            message: value.error.details[0].message,
            httpcode: HTTPCODES.UNPROCESSABLE_IDENTITY,
          })
        )
      : next();
  } catch (error) {
    console.log(error);
  }
};
// validation setup

export default validationSetUp;
