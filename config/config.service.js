import dotenv from "dotenv";
import {resolve} from "node:path";

const NODE_ENV = process.env.NODE_ENV;

let envPaths = {
  development: "development.env",
};
dotenv.config({path: resolve(`config/${envPaths[NODE_ENV]}`)});

export const PORT = +process.env.PORT;
export const SALT_ROUND = +process.env.SALT_ROUND;
export const MONGO_URI = process.env.MONGO_URI;
export const PREFIX = process.env.PREFIX;
export const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
