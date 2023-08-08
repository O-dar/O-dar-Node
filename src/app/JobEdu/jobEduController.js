const jobEduProvider = require("./jobEduProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

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

    const totalCount = await jobEduProvider.retrieveJobEduListCount();
    const totalPage = Math.ceil(totalCount / pageSize);

    // 3. 사용자가 요청한 페이지 번호(`page`)가 총 페이지 수보다 큰지 확인한다.
    if (page > totalPage) {
      throw new Error("Page out of bounds");
    }

    const resultData = {
      totalCount,
      totalPage,
      jobEduListResult,
    };

    return res.send(response(baseResponse.SUCCESS, resultData));
  } catch (error) {
    if (error.message === "Page out of bounds") {
      return res.send(errResponse(baseResponse.PAGE_OUT_OF_BOUNDS_ERROR));
    }
    console.error(error);
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

export const getJobEduBySearch = async (req, res) => {
  const keyword = req.query.keyword;
  const page = req.query.page || 1; // 페이지 번호가 주어지지 않은 경우 기본값은 1
  const pageSize = req.query.pageSize || 11; // 페이지 크기가 주어지지 않은 경우 기본값은 1
  if (!keyword) {
    return res.status(400).json({ error: "keyword is required" });
  }

  try {
    const data = await jobEduProvider.searchWithPagination(
      keyword,
      page,
      pageSize
    );
    return res.send(response(baseResponse.SUCCESS, data));
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ error: "Something went wrong" });
  }
};
