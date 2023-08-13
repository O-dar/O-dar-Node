const { logger } = require("../../../config/winston");
import pool from "../../../config/database";
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

// 알림 추가
async function insertNotice() {
  // 채용 정보 알림, 위치 알림 모두 동의
  const selectAllProvideQuery
  = `SELECT user_id, regions.region_name as region_name
    FROM users
      LEFT JOIN regions
      ON users.region_id = regions.region_id
    WHERE job_notice = 1
      AND place_notice = 1
      AND users.region_id NOTNULL`;
  // 채용 정보 알림만 동의
  const selectJobProvideQuery
  = `SELECT user_id
    FROM users
    WHERE job_notice = 1
    AND place_notice = 0`;

  // 최근 채용 정보 - 모두 동의
  const selectJobPostingForAllQuery
  = `SELECT job_posting_id, title
    FROM job_postings
    WHERE DATE_PART('DAY', NOW() - created_at) < 1
    AND region_id LIKE $1`;
  // 최근 채용 정보 - 채용만 동의
  const selectJobPostingForJobQuery
    = `SELECT job_posting_id, title
    FROM job_postings
    WHERE DATE_PART('DAY', NOW() - created_at) < 1`;

  const insertNoticesQuery
  = `INSERT INTO notices (user_id, notice_title, notice_content, job_posting_id)
    VALUES ($1, $2, $3, $4)`;
  try {
    const newNoticeText = " 공고가 추가되었습니다."

    // 채용, 위치 모두 동의
    const allProvide = await pool.query(selectAllProvideQuery);

    // 채용, 위치를 모두 동의한 사용자가 있는 경우
    if(allProvide.rows) {
      for(let i = 0; i < allProvide.rowCount; i++) {
        const user_id = allProvide.rows[i].user_id;
        // 해당 사용자의 지역에 해당되는 채용 공고 조회
        const jobPosting = await pool.query(selectJobPostingForAllQuery, [allProvide.rows[i].region_name]);

        // 새로 추가된 채용 공고가 있는 경우
        if(jobPosting.rows) {
          for(let j = 0; j < jobPosting.rowCount; j++) {
            const job_posting_id = jobPosting.rows[j].job_posting_id;
            const title = jobPosting.rows[j].title;
            const content = title + newNoticeText;

            // 알림 추가
            const insert = await pool.query(insertNoticesQuery, [user_id, title, content, job_posting_id]);
          }
        }
      }
    }


    // 채용만 동의
    const jobProvide = await pool.query(selectJobProvideQuery);

    // 채용만 동의한 사용자가 있는 경우
    if(jobProvide.rows) {
      for(let i = 0; i < jobProvide.rowCount; i++) {
        const user_id = jobProvide.rows[i].user_id;
        // 새롭게 추가된 채용 공고 조회
        const jobPosting = await pool.query(selectJobPostingForJobQuery);

        // 새로 추가된 채용 공고가 있는 경우
        if(jobPosting.rows) {
          for(let j = 0; j < jobPosting.rowCount; j++) {
            const job_posting_id = jobPosting.rows[j].job_posting_id;
            const title = jobPosting.rows[j].title;
            const content = title + newNoticeText;

            // 알림 추가
            const insert = await pool.query(insertNoticesQuery, [user_id, title, content, job_posting_id]);
          }
        }
      }
    }

    return response(baseResponse.SUCCESS, "알림 추가");
  } catch (err) {
    console.error(err);
    return errResponse(baseResponse.SERVER_ERROR);
  }
}

// 알림 조회
async function selectNotices(user_id) {
  // 최근 3일 알림만 보여주려면 아래 조건 추가
  // AND DATE_PART('DAY', NOW() - created_at) < 3
  const selectNoticesQuery = `SELECT notice_id, notice_title, notice_content
  FROM notices WHERE user_id = $1
  ORDER BY created_at DESC`;
  try {
    const selectNotices = await pool.query(selectNoticesQuery, [user_id]); // 쿼리문을 실행합니다.

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
  selectNotices,
  insertNotice
}