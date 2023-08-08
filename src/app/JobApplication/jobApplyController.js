const jobApplyService = require("./JobApplyService");
const jobApplyProvider = require("./JobApplyProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

// 지원내역 조회
export const getJobApplyList = async (req, res) => {
  const user_id = res.locals.user.id;
  console.log(user_id);
  try {
    const applyListResult = await jobApplyProvider.retrieveJobApplyList(
      user_id
    );
    return res.send(response(baseResponse.SUCCESS, applyListResult));
  } catch (error) {
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
};

// 지원내역 추가
export const createJobApply = async (req, res) => {
  try {
    // jobPostingId 가 없으면
    if (!req.body.jobPostingId) {
      return res.send(errResponse(baseResponse.JOBPOSTING_ID_EMPTY));
    }
    const user_id = res.locals.user.id;
    const job_posting_id = req.body.jobPostingId;
    const newJobApply = await jobApplyService.createJobApply(
      user_id,
      job_posting_id
    );
    return res.send(response(baseResponse.SUCCESS, newJobApply.command));
  } catch (error) {
    if (error.message === "Invalid job posting id")
      return res.send(errResponse(baseResponse.JOBPOSTING_ID_NOT_EXIST));
    else if (error.message === "User already applied for the job posting")
      return res.send(errResponse(baseResponse.APPLY_ALREADY_EXIST));
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
};

// 지원내역 삭제
export const deleteJobApply = async (req, res) => {
  // applyId 가 없으면
  if (!req.params.applyId) {
    return res.send(errResponse(baseResponse.APPLYID_EMPTY));
  }
  try {
    const user_id = res.locals.user.id;
    const apply_Id = req.params.applyId;
    const deleteJobApply = await jobApplyService.deleteJobApply(
      user_id,
      apply_Id
    );
    return res.send(response(baseResponse.SUCCESS, deleteJobApply.command));
  } catch (error) {
    if (error.message === "Invalid apply id")
      return res.send(errResponse(baseResponse.APPLYID_NOT_EXIST));
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
};
