import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../Middlewares/AsyncHandler";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import bcrypt from "bcrypt";
import crypto from "crypto";
import UserModels from "../Models/UserModels";
import {
  AccountVerificationEmail,
  ForgetPasswordEmail,
  ResendOTPEmail,
} from "../email/UserEmail";
import otpgenerator from "otp-generator";
import { addMinutes, isAfter } from "date-fns";
import { IUsers } from "../Interfaces/AllInterfaces";
import { randomBytes } from "crypto";

// Generate OTP
function generateNumericOTP(): string {
  const randomBuffer = randomBytes(2);
  const randomNumber = (randomBuffer.readUInt16BE(0) % 9000) + 1000;
  return randomNumber.toString();
}

// User Registration
export const UsersRegistration = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body }: { body?: IUsers } = req;
      if (!body) {
        throw new MainAppError({
          message: "Invalid or missing request body",
          httpcode: HTTPCODES.BAD_REQUEST,
        });
      }
      const { DOB, fullName, lastName, password, email, phoneNumber } = body;

      // Generate a random token
      const token = crypto.randomBytes(48).toString("hex");

      // Example usage
      const OTP = generateNumericOTP();
      // Set OTP expiry timestamp to 5 minutes from now
      const otpExpiryTimestamp = addMinutes(new Date(), 5);

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if the user already exists
      const existingUser = await UserModels.findOne({ email });
      if (existingUser) {
        throw new MainAppError({
          message: "This account already exists",
          httpcode: HTTPCODES.FORBIDDEN,
        });
      }

      // Create a new user
      const newUser = await UserModels.create({
        DOB,
        fullName,
        lastName,
        email,
        phoneNumber,
        OTPExpiry: otpExpiryTimestamp,
        token,
        OTP,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        isVerified: false,
      });

      // Send account verification email
      AccountVerificationEmail(newUser);

      // Respond with success message
      return res.status(201).json({
        message: "Successfully created User (OTP Expires in 5 min)",
        data: newUser?._id,
      });
    } catch (error) {
      return next(error);
    }
  }
);

// User Verification
export const UsersVerification = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body }: { body?: IUsers } = req;

      if (!body) {
        throw new MainAppError({
          message: "Invalid or missing request body",
          httpcode: HTTPCODES.BAD_REQUEST,
        });
      }
      const { OTP } = body;
      const user = await UserModels.findOne({ OTP });

      if (!user) {
        throw new MainAppError({
          message: "Wrong OTP",
          httpcode: HTTPCODES.BAD_REQUEST,
        });
      }

      const currentTimestamp = new Date();
      const userOTPExpiry = user?.OTPExpiry;
      if (userOTPExpiry === undefined) {
        throw new MainAppError({
          message: "OTPExpiry is not defined....SIGN UP",
          httpcode: HTTPCODES.BAD_REQUEST,
        });
      }

      const otpExpiry = new Date(userOTPExpiry);

      if (isAfter(currentTimestamp, otpExpiry)) {
        throw new MainAppError({
          message: "OTP has expired",
          httpcode: HTTPCODES.BAD_REQUEST,
        });
      }

      await UserModels.findByIdAndUpdate(
        user?._id,
        {
          OTP: "",
          isVerified: true,
        },
        { new: true }
      );

      return res.status(HTTPCODES.OK).json({
        message: "User Verification Successful, Proceed to Login",
      });
    } catch (error: any) {
      return next(
        new MainAppError({
          message: error.message || "An unexpected error occurred",
          httpcode: error.httpcode || HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

// // Users Login:
export const UsersLogin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body }: { body?: IUsers } = req;

      if (!body) {
        throw new MainAppError({
          message: "Invalid or missing request body",
          httpcode: HTTPCODES.BAD_REQUEST,
        });
      }

      const { email, password } = body;
      const CheckUser = await UserModels.findOne({ email });

      if (!CheckUser) {
        return next(
          new MainAppError({
            message: "This Email Does Not Exist",
            httpcode: HTTPCODES.CONFLICT,
          })
        );
      }
      const CheckPassword = await bcrypt.compare(
        password,
        CheckUser?.password!
      );
      if (!CheckPassword) {
        return next(
          new MainAppError({
            message: "Incorrect Password",
            httpcode: HTTPCODES.CONFLICT,
          })
        );
      }

      if (!CheckUser?.isVerified) {
        return next(
          new MainAppError({
            message: "You're Not Verified",
            httpcode: HTTPCODES.NOT_FOUND,
            name: CheckUser?._id,
          })
        );
      }

      return res.status(HTTPCODES.OK).json({
        message: "User Login successfull",
        data: CheckUser?._id,
      });
    } catch (error: any) {
      return res.status(HTTPCODES.BAD_GATEWAY).json({
        message: "An error occured in User Login",
        error: error.message,
      });
    }
  }
);

// // Forget Password:
export const UserForgetPassword = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { body }: { body?: IUsers } = req;

    if (!body) {
      throw new MainAppError({
        message: "Invalid or missing request body",
        httpcode: HTTPCODES.BAD_REQUEST,
      });
    }

    const { email } = body;

    try {
      const CheckEmailInDB = await UserModels.findOne({ email });

      if (!CheckEmailInDB) {
        throw new MainAppError({
          message: "Email does not exist",
          httpcode: HTTPCODES.NOT_FOUND,
        });
      }

      const OTP = generateNumericOTP();

      const upDateOTP = await UserModels.findByIdAndUpdate(
        CheckEmailInDB?._id,
        { OTP },
        { new: true }
      );

      ForgetPasswordEmail(upDateOTP);

      res.status(HTTPCODES.OK).json({
        message: "An OTP has been sent to your email",
      });
    } catch (error: any) {
      return next(
        new MainAppError({
          message: error?.message,
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

// Resend OTP
export const resendOTP = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID } = req.params;
      const getUser = await UserModels.findById(userID);

      if (!getUser) {
        throw new MainAppError({
          message: "User Not Found",
          httpcode: HTTPCODES.NOT_FOUND,
        });
      }

      const otpExpiryTimestamp = addMinutes(new Date(), 5);

      const OTP = generateNumericOTP();

      const updatedUser = await UserModels.findByIdAndUpdate(
        getUser?._id,
        {
          OTP,
          OTPExpiry: otpExpiryTimestamp,
        },
        { new: true }
      );

      ResendOTPEmail(updatedUser);

      return res.status(HTTPCODES.OK).json({
        message: "OTP Sent",
      });
    } catch (error: any) {
      console.error("Error:", error);

      if (error instanceof MainAppError) {
        return next(error);
      }

      return next(
        new MainAppError({
          message: "Internal Server Error",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const updateForgetPassword = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body }: { body?: IUsers } = req;

      if (!body) {
        throw new MainAppError({
          message: "Invalid or missing request body",
          httpcode: HTTPCODES.BAD_REQUEST,
        });
      }

      const { OTP, password, confirmPassword } = body;

      const checkingOTP = await UserModels.findOne({ OTP });

      if (!checkingOTP || checkingOTP.OTP !== OTP) {
        throw new MainAppError({
          message: "Wrong OTP",
          httpcode: HTTPCODES.NOT_ACCEPTED,
        });
      }

      if (password !== confirmPassword) {
        throw new MainAppError({
          message: "Password does not match",
          httpcode: HTTPCODES.GATEWAY_TIMEOUT,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await UserModels.findByIdAndUpdate(
        checkingOTP._id,
        {
          password: hashedPassword,
          confirmPassword: hashedPassword,
          isVerified: true,
          OTP: "",
        },
        { new: true }
      );

      return res.status(HTTPCODES.OK).json({
        message: "Password Changed",
      });
    } catch (error: any) {
      return next(
        new MainAppError({
          message: error?.message,
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const getALlUsers = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const users = await UserModels.find();

    return res.status(HTTPCODES.OK).json({
      length: users.length,
      message: users.length ? "All users" : "No users available",
      data: users.length ? users : null,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
});
