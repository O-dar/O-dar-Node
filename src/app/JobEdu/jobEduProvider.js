import pool from "../../../config/database";
const jobEduDao = require("./jobEduDao");

const { logger } = require("../../../config/winston");

export const retrieveJobEduList = async function (pageSize, page) {
  try {
    const offset = (page - 1) * pageSize;
    const result = await jobEduDao.selectJobEduList(pageSize, offset);
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

export const retrieveJobEduById = async function (jobEduId) {
  try {
    const result = await jobEduDao.selectJobEduById(jobEduId);

    return result;
  } catch (error) {
    logger.error("DB 연결 실패");
    logger.error(error);
    throw error;
  }
};

// 취업지원 검색 함수
export const searchWithPagination = async function (keyword, page, pageSize) {
  try {
    const offset = (page - 1) * pageSize;
    const result = await jobEduDao.selectJobEduByKeyword(
      keyword,
      offset,
      pageSize
    );
    const totalCount = await jobEduDao.selectJobEduTotalCountByKeyword(keyword);
    return {
      totalCount: totalCount,
      data: result,
    };
  } catch (error) {
    logger.error("DB 연결 실패");
    logger.error(error);
    throw error;
  }
};
