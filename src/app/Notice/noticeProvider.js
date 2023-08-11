import pool from "../../../config/database";
const { logger } = require("../../../config/winston");

const noticeDao = require("./noticeDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// 알림 조회
export const getNoticeForUser = async (user_id) => {
  try {
    const noticeList = await noticeDao.selectNotices(user_id);
    if (!noticeList) {
      return null;
    }
    return noticeList;
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.code}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}