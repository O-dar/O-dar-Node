const jobApplyDao = require("./jobApplyDao");

const { logger } = require("../../../config/winston");

export const retrieveJobApplyList = async function (user_id) {
  try {
    const result = await jobApplyDao.selectJobApplyList(user_id);
    return result;
  } catch (error) {
    logger.error("DB 연결 실패");
    throw error;
  }
};


// 해당 채용공고에 지원했는지 확인
export const checkPostingApply = async function (user_id, job_posting_id, job_edu_id) {
  try {
    const result = await jobApplyDao.checkApplyIdWithUserId(user_id, job_posting_id, job_edu_id);
    if (result.length > 0) return true;
    else return false;
  } catch (error) {
    logger.error("DB 연결 실패");
    throw error;
  }
}