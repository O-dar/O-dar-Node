const { logger } = require("../../../config/winston");
import pool from "../../../config/database";
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

async function selectNotices(user_id) {
  const selectNoticesQuery = `SELECT notice_id, notice_title, notice_content
  FROM notices WHERE user_id = $1 AND DATE_PART('DAY', NOW() - created_at) < 3
  ORDER BY created_at DESC`;
  try {
    const selectNotices = await pool.query(selectNoticesQuery, [160]); // 쿼리문을 실행합니다.

    let notices = null;
    if(selectNotices.rows) {
      notices = selectNotices.rows;
    }

    return response(baseResponse.SUCCESS, notices);
  } catch (err) {
    console.error(err);
    return errResponse(baseResponse.SERVER_ERROR);
  }
}

module.exports = {
  selectNotices
}