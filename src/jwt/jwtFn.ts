import jwt from "jsonwebtoken";

export const secretAccessToken = "accesstoken";
export const secretRefreshToken = "refreshtoken";

export const getnerateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, secretAccessToken, { expiresIn: "20s" });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, secretRefreshToken, { expiresIn: "1m" });
};
