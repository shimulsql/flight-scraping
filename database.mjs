import knex from "knex";
import * as dotenv from 'dotenv';
import path from 'path';

const dirname = path.resolve();
dotenv.config({ path: path.join(dirname, '.env')});

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
});


export { db }


