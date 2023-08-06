const { logger } = require("../../../config/winston");
import pool from "../../../config/database";

export const selectJobApplyList = async function (user_id) {
  const query = `
    SELECT * FROM user_job_applications WHERE user_id = ${user_id};`;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error("selectJobApplyList 쿼리 실패");
    throw error;
  }
};

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

// user_id와 job_posting_id로 지원내역 조회
export const checkApplyIdWithUserId = async function (user_id, job_posting_id) {
  const query = `
        SELECT * FROM user_job_applications WHERE user_id = ${user_id} AND job_posting_id = ${job_posting_id};`;
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error("checkApplyIdWithUserId 쿼리 실패");
    throw error;
  }
};
