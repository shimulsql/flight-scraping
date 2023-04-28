import knex from "knex";
import * as dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.PASS,
    database: process.env.DB_NAME
  }
});


export { db }


