const jobApplyDao = require("./jobApplyDao");
const jobPostingDao = require("../JobPosting/jobPostingDao");

const { logger } = require("../../../config/winston");

export const createJobApply = async function (user_id, job_posting_id) {
  try {
    // Check if the job posting id exists
    const jobPosting = await jobPostingDao.selectJobPostingById(job_posting_id);
    if (!jobPosting) {
      console.log(`jobPostingId ${job_posting_id} does not exist`);
      throw new Error("Invalid job posting id");
    }

    // Check if the user already applied for the job posting
    const apply = await jobApplyDao.checkApplyIdWithUserId(user_id, job_posting_id);
    if (apply.length !== 0) {
        console.log(`user ${user_id} already applied for job posting ${job_posting_id}`);
        throw new Error("User already applied for the job posting");
    }

    const result = await jobApplyDao.insertJobApply(user_id, job_posting_id);
    return result;
  } catch (error) {
    console.log(error);
    logger.error("DB 연결 실패");
    throw error;
  }
};

export const deleteJobApply = async function (user_id, apply_Id) {
  try {
    // Check if the apply id exists
    const apply = await jobApplyDao.checkApplyId(apply_Id);
    if (apply.length === 0) {
      console.log(`applyId ${apply_Id} does not exist`);
      throw new Error("Invalid apply id");
    }

    const result = await jobApplyDao.deleteJobApply(user_id, apply_Id);
    return result;
  } catch (error) {
    console.log(error);
    logger.error("DB 연결 실패");
    throw error;
  }
};
