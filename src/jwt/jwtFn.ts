import jwt from "jsonwebtoken";

export const accessToken = "accesstoken";
 export const refreshToken = "refreshtoken";

export const getnerateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, accessToken, { expiresIn: "20s" });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, refreshToken, { expiresIn: "1m" });
};
