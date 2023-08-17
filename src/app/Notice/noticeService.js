import pool from "../../../config/database";
import hashPassword from "../../../utils/hashPassword";

const { logger } = require("../../../config/winston");
const noticeDao = require("./noticeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// 알림 추가
export const addNewNotice = async function () {
  try {

    const addNoticeResult = await noticeDao.insertNotice();
    
    //return response(baseResponse.SUCCESS);
    return addNoticeResult;
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.code}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};