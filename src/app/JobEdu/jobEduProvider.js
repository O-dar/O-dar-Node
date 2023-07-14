import pool from "../../../config/database";
const jobEduDao = require("./jobEduDao");

const { logger } = require("../../../config/winston");

export const retrieveJobEduList = async function (perPage, page) {
  try {
    const offset = (page - 1) * perPage;
    const result = await jobEduDao.selectJobEduList(perPage, offset);
    return result;
  } catch (error) {
    logger.error("DB 연결 실패");
    throw error;
  }
};

// 취업지원 데이터 갯수 세는 함수
export const retrieveJobEduListCount = async function () {
  try {
    const result = await jobEduDao.selectJobEduListCount();

    return parseInt(result.rows[0]["total_count"]);
  } catch (error) {
    logger.error("DB 연결 실패");
    logger.error(error);
    throw error;
  }
};
