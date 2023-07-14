import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

// TODO: 본인의 DB 계정 입력
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
}

const pool = new pg.Pool(dbConfig);

export default pool;
