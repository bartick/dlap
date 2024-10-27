import { Sequelize } from "sequelize-typescript";
import {
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_PORT,
  DB_DIALECT,
} from "../utils/config";

// Database connection
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  models: [__dirname + "/models/*.model.ts"],
});

export default sequelize;

export { default as AccessTokenModel } from "./models/access_token.model";
export { default as PublicDataModel } from "./models/public_data.model";
export { default as SecretModel } from "./models/secret.model";