const { logger } = require("../../../config/winston");
import pool from "../../../config/database";

export const selectJobApplyList = async function (user_id) {
  // 최근 10개 지원내역 조회
  const query = `
    SELECT * FROM user_job_applications WHERE user_id = ${user_id} ORDER BY CREATED_AT DESC LIMIT 10;`;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error("selectJobApplyList 쿼리 실패");
    throw error;
  }
};

// 채용공고 지원내역 추가
export const insertJobApply = async function (user_id, job_posting_id) {
  const query = `
    INSERT INTO user_job_applications (user_id, job_posting_id) VALUES (${user_id}, ${job_posting_id});`;

  try {
    const result = await pool.query(query);
    return result;
  } catch (error) {
    logger.error("insertJobApply 쿼리 실패");
    throw error;
  }
};

// 취업교육 지원내역 추가
export const insertJobEduApply = async function (user_id, job_edu_id) {
  const query = `
    INSERT INTO user_job_applications (user_id, job_edu_id) VALUES (${user_id}, ${job_edu_id});`;

  try {
    const result = await pool.query(query);
    return result;
  } catch (error) {
    logger.error("insertJobEduApply 쿼리 실패");
    throw error;
  }
};



// 지원내역 삭제
export const deleteJobApply = async function (user_id, apply_Id) {
  const query = `
    DELETE FROM user_job_applications WHERE user_id = ${user_id} AND apply_Id = ${apply_Id};`;

  try {
    const result = await pool.query(query);
    return result;
  } catch (error) {
    logger.error("deleteJobApply 쿼리 실패");
    throw error;
  }
};

// apply_id로 지원내역 조회
export const checkApplyId = async function (apply_Id) {
  const query = `
      SELECT * FROM user_job_applications WHERE apply_id = ${apply_Id};`;
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error("checkApplyId 쿼리 실패");
    throw error;
  }
};

// user_id와 job_posting_id/job_edu_id 로 지원내역 조회
export const checkApplyIdWithUserId = async function (user_id, job_posting_id, job_edu_id) {
  const query = job_posting_id ? `
        SELECT * FROM user_job_applications WHERE user_id = ${user_id} AND job_posting_id = ${job_posting_id};`
        : `
        SELECT * FROM user_job_applications WHERE user_id = ${user_id} AND job_edu_id = ${job_edu_id};`;
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error("checkApplyIdWithUserId 쿼리 실패");
    throw error;
  }
};
