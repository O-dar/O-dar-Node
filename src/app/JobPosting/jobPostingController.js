const jobPostingProvider = require("./jobPostingProvider");
const jobPostingDao = require("./jobPostingDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

// 채용공고 목록 조회
export const getjobPostingList = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 11;
    const active_status = req.query.active_status;

    const jobPostingListResult =
      await jobPostingProvider.retrieveJobPostingList(
        pageSize,
        page,
        active_status
      );

    return res.send(response(baseResponse.SUCCESS, jobPostingListResult));
  } catch (error) {
    console.error(error);
    if (error.message === "Page out of bounds") {
      return res.send(errResponse(baseResponse.PAGE_OUT_OF_BOUNDS_ERROR));
    }
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
};

// 채용공고 목록 개수 조회
export const getJobPostingListCount = async (req, res) => {
  const jobPostingListCountResult =
    await jobPostingProvider.retrieveJobPostingListCount();

  return res.send(response(baseResponse.SUCCESS, jobPostingListCountResult));
};

export const getJobPostingById = async (req, res) => {
  const jobPostingId = req.params.jobPostingId;

  // 해당 id 의 구직공고가 없으면 에러
  if (!jobPostingId)
    return res.send(errResponse(baseResponse.JOBPOSTING_ID_EMPTY));

  const jobPostingByIdResult = await jobPostingProvider.retrieveJobPostingById(
    jobPostingId
  );
  if (!jobPostingByIdResult) {
    return res.send(errResponse(baseResponse.JOBPOSTING_ID_NOT_EXIST));
  }

  return res.send(response(baseResponse.SUCCESS, jobPostingByIdResult));
};

// 채용공고 키워드 검색
export const getJobPostingBySearch = async (req, res) => {
  const keyword = req.query.keyword;
  const page = req.query.page || 1; // 페이지 번호가 주어지지 않은 경우 기본값은 1
  const pageSize = req.query.pageSize || 11; // 페이지 크기가 주어지지 않은 경우 기본값은 11
  const active_status = req.query.active_status;

  // 키워드가 없으면 에러
  if (!keyword) {
    return res.status(400).json({ error: "keyword is required" });
  }

  try {
    const data = await jobPostingProvider.searchWithPagination(
      keyword,
      page,
      pageSize,
      active_status
    );
    return res.send(response(baseResponse.SUCCESS, data));
  } catch (err) {
    if (err.message === "No search results") {
      return res.send(errResponse(baseResponse.JOBPOSTING_SEARCH_EMPTY));
    }
    if (err.message === "Page out of bounds") {
      return res.send(errResponse(baseResponse.PAGE_OUT_OF_BOUNDS_ERROR));
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

// 지역이름 id로 바꾸기
export const regionToregionId = async (req, res) => {
  // job_postings 테이블에 있는 모든 데이터를 가져온다.
  const jobPostingList = await jobPostingDao.selectAllJobPosting();
  jobPostingList.forEach(async (row) => {
    const region = row.region_id;
    let region_id2;
    // region_id 가 4글자 이하이고 읍/면/동 으로 끝나면
    if (region.length <= 4 && region.endsWith("읍")) {
      // regions 테이블에서 해당 지역명을 찾아서 region_id2 로 바꾼다.
      region_id2 = await jobPostingDao.selectRegionIdByRegionName(region);
    } else if (region.length <= 4 && region.endsWith("면")) {
      region_id2 = await jobPostingDao.selectRegionIdByRegionName(region);
    } else if (region.length <= 4 && region.endsWith("동")) {
      region_id2 = await jobPostingDao.selectRegionIdByRegionName(region);
    } else {
      // 그 외에는 8번(기타)으로 바꾼다.
      region_id2 = 8;
    }
    // region_id2 로 바꾼다.
    const result = await jobPostingDao.updateRegionId(
      row.job_posting_id,
      region_id2
    );
    console.log(result);
  });
  return res.send(response(baseResponse.SUCCESS));
};
