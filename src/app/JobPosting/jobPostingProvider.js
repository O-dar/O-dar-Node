const jobPostingDao = require("./jobPostingDao");

const { logger } = require("../../../config/winston");

// 채용공고 목록 조회
export const retrieveJobPostingList = async function (
  pageSize,
  page,
  active_status
) {
  try {
    // 1. 총 데이터의 개수를 알아낸다.
    const totalCountResult = await jobPostingDao.selectJobPostingListCount(active_status);
    const totalCount = totalCountResult.rows[0].total_count;

    // 2. 주어진 `pageSize`에 따라 총 페이지 수를 계산한다.
    const totalPage = Math.ceil(totalCount / pageSize);

    // 3. 사용자가 요청한 페이지 번호(`page`)가 총 페이지 수보다 큰지 확인한다.
    if (page > totalPage) {
      throw new Error("Page out of bounds");
    }

    const offset = (page - 1) * pageSize;
    const result = await jobPostingDao.selectJobPostingList(
      pageSize,
      offset,
      active_status
    );
    return { totalCount, totalPage, result };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// 채용공고 데이터 갯수 세는 함수
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

// 채용공고 상세 조회
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

// 채용공고 키워드 검색
export const searchWithPagination = async function (keyword, page, pageSize, active_status) {
  try {
    // 1. 총 데이터의 개수를 알아낸다.
    const totalCount = await jobPostingDao.selectJobPostingTotalCountByKeyword(
      keyword,
      active_status
    );
    console.log(totalCount);
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
    const result = await jobPostingDao.selectJobPostingByKeyword(
      keyword,
      offset,
      pageSize,
      active_status
    );
    return { totalCount, totalPage, result };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
