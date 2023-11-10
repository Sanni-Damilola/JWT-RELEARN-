import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { google } from "googleapis";

import { EnvironmentVariables } from "../Config/EnvironmentVariables";

const clientId = EnvironmentVariables.google_id;
const clientSecret = EnvironmentVariables.google_secret;
const refreshToken =
  "1//04GUtuw7JeuxYCgYIARAAGAQSNwF-L9IroTMvzhkr6oNRxm63Cima8oRzQU4tIsivTj9EPBmDL9qUatQODhDhkP0qbP4qut3HUdE";

const GOOGLE_REDIRECT = EnvironmentVariables.google_redirectToken;

const oAuth = new google.auth.OAuth2(clientId, clientSecret, GOOGLE_REDIRECT);
oAuth.setCredentials({ refresh_token: refreshToken });

// Resend OTP for users
export const ResendOTPEmail = async (user: any) => {
  const accessToken: any = (await oAuth.getAccessToken()).token;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EnvironmentVariables.user,
      clientId,
      clientSecret,
      refreshToken,
      accessToken,
    },
  });

  const loadFile = path.join(__dirname, "../../views/User/ResendOTP.ejs");

  const ReadUserData = await ejs.renderFile(loadFile, {
    fullName: user.fullName,
    email: user.email,
    OTP: user.OTP,
  });

  const mailOptions = {
    from: EnvironmentVariables.from,
    to: user?.email,
    subject: "Account Verification Email",
    html: ReadUserData,
  };

  transport
    .sendMail(mailOptions)
    .then(() => {
      console.log("Resent OTP Successfully..");
    })
    .catch((err) => {
      console.log("An error occured in sending email", err);
    });
};

// Forget your password email:
export const ForgetPasswordEmail = async (user: any) => {
  const accessToken: any = (await oAuth.getAccessToken()).token;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EnvironmentVariables.user,
      clientId,
      clientSecret,
      refreshToken,
      accessToken,
    },
  });

  const loadFile = path.join(
    __dirname,
    "../../views/User/ForgetPasswordForUser.ejs"
  );

  const ReadUserData = await ejs.renderFile(loadFile, {
    fullName: user.fullName,
    OTP: user.OTP,
  });

  const mailOptions = {
    from: EnvironmentVariables.from,
    to: user?.email,
    subject: "Forget passsword",
    html: ReadUserData,
  };

  transport
    .sendMail(mailOptions)
    .then(() => {
      console.log("Forget passsword Email Sent.."); // success message
    })
    .catch((err) => {
      console.log("An error occured in sending email", err); // err
    });
};

// Verify account/email by taking OTP from email
export const AccountVerificationEmail = async (user: any) => {
  const accessToken: any = (await oAuth.getAccessToken()).token;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EnvironmentVariables.user,
      clientId,
      clientSecret,
      refreshToken,
      accessToken,
    },
  });

  const loadFile = path.join(
    __dirname,
    "../../views/User/AccountVerification.ejs"
  );

  const ReadUserData = await ejs.renderFile(loadFile, {
    fullName: user.fullName,
    email: user.email,
    OTP: user.OTP,
  });

  const mailOptions = {
    from: EnvironmentVariables.from,
    to: user?.email,
    subject: "Welcome to Mula Wallet",
    html: ReadUserData,
  };

  transport
    .sendMail(mailOptions)
    .then(() => {
      console.log("Verification Email Sent..");
    })
    .catch((err) => {
      console.log("An error occured in sending welcome email", err);
    });
};
