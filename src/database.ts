import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB_TEST,
  POSTGRES_DB_PORT
} = process.env;

let config = {};
console.log(process.env.ENV);

if (process.env.ENV === 'dev') {
  config = {
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    port: POSTGRES_DB_PORT
  }
}
if (process.env.ENV === 'test') {
  config = {
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB_TEST,
    port: POSTGRES_DB_PORT
  }}

const client = new Pool(config);

export default client;