// const express = require('./config/express');
import express from './config/express';
import client from './config/database';
const {logger} = require('./config/winston');

const port = 3000;
express().listen(port);

logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);