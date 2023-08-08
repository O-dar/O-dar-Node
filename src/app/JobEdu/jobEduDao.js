const { logger } = require("../../../config/winston");
import pool from "../../../config/database";

export const selectJobEduList = async function (
  pageSize,
  offset,
  active_status
) {
  const query = active_status
    ? `SELECT * FROM job_educations WHERE active_status = ${active_status} ORDER BY posted_at DESC LIMIT ${pageSize} OFFSET ${offset}`
    : `SELECT * FROM job_educations ORDER BY posted_at DESC LIMIT ${pageSize} OFFSET ${offset}`;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error("selectJobEduList쿼리 실패");
    throw error;
  }
};

export const selectJobEduListCount = async function (active_status) {
  const query = active_status
    ? `select count(*) as total_count from job_educations WHERE active_status = ${active_status};`
    : `      select count(*) as total_count from job_educations;
    `;

  try {
    const result = await pool.query(query);
    return result;
  } catch (error) {
    logger.error("selectJobEduListCount 쿼리 실패");
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
    logger.error("selectJobEduById 쿼리 실패");
    throw error;
  }
};

// 취업교육 검색결과 데이터 가져오는 쿼리
export const selectJobEduByKeyword = async function (
  keyword,
  offset,
  pageSize,
  active_status
) {
  const query = active_status
    ? `SELECT * FROM job_educations WHERE (title LIKE '%${keyword}%' OR content LIKE '%${keyword}%') AND
  active_status = ${active_status} ORDER BY posted_at DESC LIMIT ${pageSize} OFFSET ${offset};`
    : `SELECT * FROM job_educations WHERE title LIKE '%${keyword}%' OR content LIKE '%${keyword}%' ORDER BY posted_at DESC LIMIT ${pageSize} OFFSET ${offset};`;
    
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error("selectJobEduByKeyword 쿼리 실패");
    throw error;
  }
};

// 취업교육 검색결과 데이터 갯수 세는 쿼리
export const selectJobEduTotalCountByKeyword = async function (
  keyword,
  active_status
) {
  const query = active_status
    ? `SELECT count(*) as total_count FROM job_educations WHERE (title LIKE '%${keyword}%' OR content LIKE '%${keyword}%') AND
  active_status = ${active_status};`
    : `SELECT count(*) as total_count FROM job_educations WHERE title LIKE '%${keyword}%' OR content LIKE '%${keyword}%';
  `;

  try {
    const result = await pool.query(query);
    return result.rows[0]["total_count"];
  } catch (error) {
    logger.error("selectJobEduTotalCountByKeyword 쿼리 실패");
    throw error;
  }
};
