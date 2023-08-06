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
