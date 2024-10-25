import { Sequelize } from "sequelize";
import {
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_PORT,
  DB_DIALECT
} from '../utils/config';

import * as models from '../models';

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
});

for (const model of Object.values(models)) {
  model(sequelize);
}

export default sequelize;