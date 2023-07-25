// const express = require('./config/express');
import express from './config/express';
import pool from './config/database';
const {logger} = require('./config/winston');

const port = 3000;

express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

// Database 연결
/*try {
  pool.connect();
  logger.info("Database 연결 성공");
} catch (error) {
  logger.error("Database 연결 실패");
  logger.error(error);
}*/