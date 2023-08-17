// const express = require('./config/express');
import express from "./config/express";
import pool from "./config/database";
const { logger } = require("./config/winston");
const https = require("https"); // 추가
const fs = require("fs"); // 추가
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;

const options = {
  key: fs.readFileSync("privkey.pem"), // 실제 키 파일 경로로 변경하세요.
  cert: fs.readFileSync("fullchain.pem"), // 실제 인증서 파일 경로로 변경하세요.
};

const app = express();
https.createServer(options, app).listen(port); // https 쓰려고 변경된 부분
// express().listen(port);

logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

// Database 연결
/*try {
  pool.connect();
  logger.info("Database 연결 성공");
} catch (error) {
  logger.error("Database 연결 실패");
  logger.error(error);
}*/
