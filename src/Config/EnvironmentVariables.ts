import dotenv from "dotenv";

dotenv.config({ path: "./env/.env" });

const EnvironmentVariables = {
  DB_LIVEURI: process.env.DB_Connection_String,
  DB_LOCALURL: process.env.MongoDB_URL,
  PORT: process.env.PORT,
  google_id: process.env.google_id as string,
  google_secret: process.env.google_secret as string,
  google_refreshToken: process.env.google_refreshToken as string,
  google_redirectToken: process.env.google_redirectToken as string,
  from: process.env.from as string,
  user: process.env.user as string,
  type: process.env.type as string,
};

export default EnvironmentVariables;
