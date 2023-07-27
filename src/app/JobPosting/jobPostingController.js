const jobPostingProvider = require("./jobPostingProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

// 구직공고 목록 조회
export const getjobPostingList = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
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
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
};

export const getJobPostingListCount = async (req, res) => {
    const jobPostingListCountResult = await jobPostingProvider.retrieveJobPostingListCount();
  
    return res.send(response(baseResponse.SUCCESS, jobPostingListCountResult));
  };
  
  export const getJobPostingById = async (req, res) => {
    const jobPostingId = req.params.jobPostingId;
    
    // 해당 id 의 구직공고가 없으면 에러
    if (!jobPostingId) return res.send(errResponse(baseResponse.JOBPOSTING_ID_EMPTY));
  
    const jobPostingByIdResult = await jobPostingProvider.retrieveJobPostingById(jobPostingId);
    if (!jobPostingByIdResult) {
        return res.send(errResponse(baseResponse.JOBPOSTING_ID_NOT_EXIST));
    }
  
    return res.send(response(baseResponse.SUCCESS, jobPostingByIdResult));
  };
  
  // 구직공고 키워드 검색
  export const getJobPostingBySearch = async (req, res) => {
    const keyword = req.query.keyword;
    const page = req.query.page || 1; // 페이지 번호가 주어지지 않은 경우 기본값은 1
    const pageSize = req.query.pageSize || 10; // 페이지 크기가 주어지지 않은 경우 기본값은 10
    if (!keyword) {
      return res.status(400).json({ error: "keyword is required" });
    }
  
    try {
      const data = await jobPostingProvider.searchWithPagination(
        keyword,
        page,
        pageSize
      );
      // data.totalCount int 로 바꾸기
      if (parseInt(data.totalCount) === 0) {
        return res.send(errResponse(baseResponse.JOBPOSTING_SEARCH_EMPTY));
      }
      return res.send(response(baseResponse.SUCCESS, data));
    } catch (err) {
      console.log(err.stack);
      res.status(500).json({ error: "Something went wrong" });
    }
  };
  