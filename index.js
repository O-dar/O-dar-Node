// const express = require('./config/express');
import express from './config/express';
import client from './config/database';
const {logger} = require('./config/winston');

const port = 3000;
express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

// db 연결
try {
    client.connect()
    logger.info('DB 연결 성공')

    // job_educations 테이블 조회
    client.query('SELECT * FROM job_educations', (err, res) => {
        if (err) {
            logger.error(err.stack)
        }
        else {
            console.log(res.rows[0])
        }
    })

} catch (error) {
    logger.error('DB 연결 실패')
    logger.error(error)
}

