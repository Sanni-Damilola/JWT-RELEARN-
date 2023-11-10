import { Router } from "express";

import {
  ValidateUserLogin,
  ValidateUserOTP,
  ValidateUserSignUp,
} from "../validation/UserValidation/UserValidation";

import {
  UserForgetPassword,
  UsersLogin,
  UsersRegistration,
  UsersVerification,
  getALlUsers,
  resendOTP,
  updateForgetPassword,
} from "../Controllers/UserControllers";

const UserRoute = Router();

UserRoute.route("/register-user").post(ValidateUserSignUp, UsersRegistration);
UserRoute.route("/login-user").post(ValidateUserLogin, UsersLogin);
UserRoute.route("/verify-user").post(ValidateUserOTP, UsersVerification);
UserRoute.route("/forget-password").post(UserForgetPassword);
UserRoute.route("/change-password").patch(updateForgetPassword);
UserRoute.route("/:userID/resendotp").patch(resendOTP);
UserRoute.route("/getallusers").get(getALlUsers);

export default UserRoute;
