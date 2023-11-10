import Joi from "joi";

export const UserSchemaValidation = {
  UserSignUp: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({
        "any.only": "Password and Confirm Password must be the same",
        "any.required": "Confirm Password is required",
      }),
  }),
  UserLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  UserOTP: Joi.object({
    OTP: Joi.string().required(),
  }),
};
