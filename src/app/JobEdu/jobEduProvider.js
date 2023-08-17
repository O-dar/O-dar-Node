import pool from "../../../config/database";
const jobEduDao = require("./jobEduDao");

const { logger } = require("../../../config/winston");

// 취업지원 목록 조회
export const retrieveJobEduList = async function (pageSize, page, active_status) {
  try {
    // 1. 총 데이터의 개수를 알아낸다.
    const totalCountResult = await jobEduDao.selectJobEduListCount(active_status);
    const totalCount = totalCountResult.rows[0].total_count;

    // 2. 주어진 `pageSize`에 따라 총 페이지 수를 계산한다.
    const totalPage = Math.ceil(totalCount / pageSize);

    // 3. 사용자가 요청한 페이지 번호(`page`)가 총 페이지 수보다 큰지 확인한다.
    if (page > totalPage) {
      throw new Error("Page out of bounds");
    }

    const offset = (page - 1) * pageSize;
    const result = await jobEduDao.selectJobEduList(pageSize, offset, active_status);
    return { totalCount, totalPage, result };
  } catch (error) {
    logger.error(error);
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
export const searchWithPagination = async function (keyword, page, pageSize, active_status) {
  try {
    // 1. 총 데이터의 개수를 알아낸다.
    const totalCount = await jobEduDao.selectJobEduTotalCountByKeyword(keyword, active_status);
    // 검색결과가 없으면 에러
    if (parseInt(totalCount) === 0) {
      throw new Error("No search results");
    }

    // 2. 주어진 `pageSize`에 따라 총 페이지 수를 계산한다.
    const totalPage = Math.ceil(totalCount / pageSize);

    // 3. 사용자가 요청한 페이지 번호(`page`)가 총 페이지 수보다 큰지 확인한다.
    if (page > totalPage) {
      throw new Error("Page out of bounds");
    }

    const offset = (page - 1) * pageSize;
    const result = await jobEduDao.selectJobEduByKeyword(
      keyword,
      offset,
      pageSize,
      active_status
    );
    return { totalCount, totalPage, result };
  } catch (error) {
    logger.error("DB 연결 실패");
    logger.error(error);
    throw error;
  }
};
