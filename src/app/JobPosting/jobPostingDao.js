const { logger } = require("../../../config/winston");
import pool from "../../../config/database";

// 모든 채용공고 데이터 가져오는 쿼리
export const selectAllJobPosting = async function () {
  const query = `SELECT * FROM job_postings;`;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error("selectAllJobPosting 쿼리 실패");
    throw error;
  }
};

// 채용공고 페이지네이션으로 가져오는 쿼리
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

// 지역이름으로 지역id 가져오기
export const selectRegionIdByRegionName = async function (regionName) {
  const query = `SELECT region_id FROM regions WHERE region_name = '${regionName}';`;

  try {
    const result = await pool.query(query);
    return result.rows[0]["region_id"];
  } catch (error) {
    console.log(regionName);
    logger.error("selectRegionIdByRegionName 쿼리 실패");
    throw error;
  }
};

// 지역이름으로 지역id 분류하기
export const updateRegionId = async function (jobPostingId, regionId) {
  const query = `UPDATE job_postings SET region_id2 = ${regionId} WHERE job_posting_id = ${jobPostingId};`;

  try {
    const result = await pool.query(query);
    return result;
  } catch (error) {
    logger.error("updateRegionId 쿼리 실패");
    throw error;
  }
};

// regions 테이블에 있는 모든 데이터 가져오기
export const selectAllRegions = async function () {
  const query = `SELECT * FROM regions;`;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error("selectAllRegions 쿼리 실패");
    throw error;
  }
};

// region에 위도경도 추가하는 쿼리
export const updateCenter = async function (region_id, lat, lng) {
  const query = `UPDATE regions SET latitude = ${lat}, longitude = ${lng} WHERE region_id = ${region_id};`;

  try {
    const result = await pool.query(query);
    return result;
  } catch (error) {
    logger.error("updateCenter 쿼리 실패");
    throw error;
  }
};
