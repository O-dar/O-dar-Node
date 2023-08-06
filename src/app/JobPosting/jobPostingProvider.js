const jobPostingDao = require("./jobPostingDao");

const { logger } = require("../../../config/winston");

// 구직공고 목록 조회
export const retrieveJobPostingList = async function (
  pageSize,
  page,
  active_status
) {
  try {
    const offset = (page - 1) * pageSize;
    const result = await jobPostingDao.selectJobPostingList(
      pageSize,
      offset,
      active_status
    );
    return result;
  } catch (error) {
    logger.error("DB 연결 실패");
    throw error;
  }
};

// 구직공고 데이터 갯수 세는 함수
export const retrieveJobPostingListCount = async function () {
  try {
    const result = await jobPostingDao.selectJobPostingListCount();

    return parseInt(result.rows[0]["total_count"]);
  } catch (error) {
    logger.error("DB 연결 실패");
    logger.error(error);
    throw error;
  }
};

// 구직공고 상세 조회
export const retrieveJobPostingById = async function (jobPostingId) {
  try {
    const result = await jobPostingDao.selectJobPostingById(jobPostingId);

    return result;
  } catch (error) {
    logger.error("DB 연결 실패");
    logger.error(error);
    throw error;
  }
};

// 구직공고 키워드 검색 함수
export const searchWithPagination = async function (keyword, page, pageSize) {
  try {
    const offset = (page - 1) * pageSize;
    const result = await jobPostingDao.selectJobPostingByKeyword(
      keyword,
      offset,
      pageSize
    );
    const totalCount = await jobPostingDao.selectJobPostingTotalCountByKeyword(
      keyword
    );
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
