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
  refreshToken,
  resendOTP,
  updateForgetPassword,
} from "../Controllers/UserControllers";
import { encryptData } from "../encoding/encoding";

const UserRoute = Router();

UserRoute.route("/register-user").post(ValidateUserSignUp, UsersRegistration);
UserRoute.route("/login-user").post(ValidateUserLogin, UsersLogin);
UserRoute.route("/verify-user").post(ValidateUserOTP, UsersVerification);
UserRoute.route("/forget-password").post(UserForgetPassword);
UserRoute.route("/change-password").patch(encryptData, updateForgetPassword);
UserRoute.route("/:userID/resendotp").patch(encryptData, resendOTP);
UserRoute.route("/refresh-token").post(refreshToken);
UserRoute.route("/getallusers").get(encryptData, getALlUsers);

export default UserRoute;
