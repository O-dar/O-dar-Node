const { logger } = require("../../../config/winston");
import pool from "../../../config/database";

export const selectJobPostingList = async function (
  pageSize,
  offset,
  active_status
) {
  const query = active_status
    ? `SELECT * FROM job_postings WHERE active_status = ${active_status} ORDER BY posted_at DESC LIMIT ${pageSize} OFFSET ${offset}`
    : `SELECT * FROM job_postings ORDER BY posted_at DESC LIMIT ${pageSize} OFFSET ${offset}`;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error("selectJobPostingList쿼리 실패");
    throw error;
  }
};

export const selectJobPostingListCount = async function (active_status) {
  const query = active_status
    ? `select count(*) as total_count from job_postings WHERE active_status = ${active_status};`
    : `      select count(*) as total_count from job_postings;
    `;

  try {
    const result = await pool.query(query);
    return result;
  } catch (error) {
    logger.error("selectJobPostingListCount 쿼리 실패");
    throw error;
  }
};

export const selectJobPostingById = async function (jobPostingId) {
  const query = `
  SELECT * FROM job_postings WHERE job_posting_id = ${jobPostingId};`;

  try {
    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    logger.error("selectJobPostingById 쿼리 실패");
    throw error;
  }
};

// 채용공고 검색결과 데이터 가져오는 쿼리
export const selectJobPostingByKeyword = async function (
  keyword,
  offset,
  pageSize,
  active_status
) {
  const query = active_status
    ? `SELECT * FROM job_postings WHERE (title LIKE '%${keyword}%' OR content LIKE '%${keyword}%') AND
  active_status = ${active_status} ORDER BY posted_at DESC LIMIT ${pageSize} OFFSET ${offset};`
    : `
  SELECT * FROM job_postings WHERE title LIKE '%${keyword}%' OR content LIKE '%${keyword}%' ORDER BY posted_at DESC LIMIT ${pageSize} OFFSET ${offset};`;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error("selectJobPostingByKeyword 쿼리 실패");
    throw error;
  }
};

// 채용공고 검색결과 데이터 갯수 세는 쿼리
export const selectJobPostingTotalCountByKeyword = async function (
  keyword,
  active_status
) {
  const query = active_status
    ? `SELECT count(*) as total_count FROM job_postings WHERE (title LIKE '%${keyword}%' OR content LIKE '%${keyword}%') AND
  active_status = ${active_status};`
    : `SELECT count(*) as total_count FROM job_postings WHERE title LIKE '%${keyword}%' OR content LIKE '%${keyword}%';`;

  try {
    const result = await pool.query(query);
    return result.rows[0]["total_count"];
  } catch (error) {
    logger.error("selectJobPostingTotalCountByKeyword 쿼리 실패");
    throw error;
  }
};
