import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const dbconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
}

const client = new pg.Client(dbconfig)

export default client;
