import pool from "../../../config/database";
import hashPassword from "../../../utils/hashPassword";

const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const schedule = require('node-schedule');

// 1. 알림 생성
export const addNotice = function () {
  schedule.scheduleJob('0 * * * * *', function(){
    console.log('The answer to life, the universe, and everything!');
  });
}