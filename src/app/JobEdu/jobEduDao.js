const { logger } = require("../../../config/winston");
import pool from "../../../config/database";

export const selectJobEduList = async function (perPage, offset) {
  const query = `
  SELECT * FROM job_educations ORDER BY posted_at DESC LIMIT ${perPage} OFFSET ${offset}`;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error("쿼리 실패");
    throw error;
  }
};

export const selectJobEduListCount = async function () {
  const query = `
        select count(*) as total_count from job_educations;
    `;

  try {
    const result = await pool.query(query);
    return result;
  } catch (error) {
    logger.error("쿼리 실패");
    throw error;
  }
};

export const selectJobEduById = async function (jobEduId) {
  const query = `
  SELECT * FROM job_educations WHERE job_edu_id = ${jobEduId};`;

  try {
    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    logger.error("쿼리 실패");
    throw error;
  }
};
