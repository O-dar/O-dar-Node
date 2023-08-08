const jobEduProvider = require("./jobEduProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

// 취업교육 목록 조회
export const getJobEduList = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 11;
    const active_status = req.query.active_status;

    const jobEduListResult = await jobEduProvider.retrieveJobEduList(
      pageSize,
      page,
      active_status
    );
    
    return res.send(response(baseResponse.SUCCESS, jobEduListResult));
  } catch (error) {
    console.error(error);
    if (error.message === "Page out of bounds") {
      return res.send(errResponse(baseResponse.PAGE_OUT_OF_BOUNDS_ERROR));
    }
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
};

export const getJobEduListCount = async (req, res) => {
  const jobEduListCountResult = await jobEduProvider.retrieveJobEduListCount();

  return res.send(response(baseResponse.SUCCESS, jobEduListCountResult));
};

export const getJobEduById = async (req, res) => {
  const jobEduId = req.params.jobEduId;

  if (!jobEduId) return res.send(errResponse(baseResponse.JOBEDU_ID_EMPTY));
  
  const jobEduByIdResult = await jobEduProvider.retrieveJobEduById(jobEduId);
  // 해당 id 의 구직공고가 존재하지 않으면 에러
  if (!jobEduByIdResult)
    return res.send(errResponse(baseResponse.JOBEDU_ID_NOT_EXIST));

  return res.send(response(baseResponse.SUCCESS, jobEduByIdResult));
};

// 취업교육 키워드 검색
export const getJobEduBySearch = async (req, res) => {
  const keyword = req.query.keyword;
  const page = req.query.page || 1; // 페이지 번호가 주어지지 않은 경우 기본값은 1
  const pageSize = req.query.pageSize || 11; // 페이지 크기가 주어지지 않은 경우 기본값은 1
  const active_status = req.query.active_status;

  // 키워드가 없으면 에러
  if (!keyword) {
    return res.status(400).json({ error: "keyword is required" });
  }

  try {
    const data = await jobEduProvider.searchWithPagination(
      keyword,
      page,
      pageSize,
      active_status
    );
    return res.send(response(baseResponse.SUCCESS, data));
  } catch (error) {
    if(error.message === "No search results") {
      return res.send(errResponse(baseResponse.JOBEDU_SEARCH_EMPTY));
    }
    if(error.message === "Page out of bounds") {
      return res.send(errResponse(baseResponse.PAGE_OUT_OF_BOUNDS_ERROR));
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};
