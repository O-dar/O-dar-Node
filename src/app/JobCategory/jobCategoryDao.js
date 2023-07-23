const { logger } = require("../../../config/winston");
import pool from "../../../config/database";
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

// 1. 직군 선택지 조회 API
async function selectJobCategories() {
  const selectJobCategoriesQuery = `
    SELECT *
    FROM job_categories;
  `;

  try {
    const JobCategories = await pool.query(selectJobCategoriesQuery); // 쿼리문을 실행합니다.
    return response(baseResponse.SUCCESS, JobCategories.rows); // 직군 선택지 정보를 반환
  } catch (err) {
    console.error(err);
    return errResponse(baseResponse.SERVER_ERROR);
  }
}


module.exports = {
  selectJobCategories,
};