const jobEduProvider = require("./jobEduProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

export const getJobEduList = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const active_status = req.query.active_status;

    const jobEduListResult = await jobEduProvider.retrieveJobEduList(
      pageSize,
      page,
      active_status
    );

    return res.send(response(baseResponse.SUCCESS, jobEduListResult));
  } catch (error) {
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

  return res.send(response(baseResponse.SUCCESS, jobEduByIdResult));
};

export const getJobEduBySearch = async (req, res) => {
  const keyword = req.query.keyword;
  const page = req.query.page || 1; // 페이지 번호가 주어지지 않은 경우 기본값은 1
  const pageSize = req.query.pageSize || 10; // 페이지 크기가 주어지지 않은 경우 기본값은 10
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
