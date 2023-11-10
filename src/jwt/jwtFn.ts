import jwt from "jsonwebtoken";

const accessToken = "accesstoken";
const refreshToken = "refreshtoken";

export const getnerateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, accessToken, { expiresIn: "20s" });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, refreshToken, { expiresIn: "1m" });
};
