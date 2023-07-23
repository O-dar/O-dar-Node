const { logger } = require("../../../config/winston");
import pool from "../../../config/database";
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");


//insertUserInfoParams
// 유저 생성
async function insertUserInfo(insertUserInfoParams) {
  const insertUserInfoQuery = `
    INSERT INTO users (email, password, name, birthdate, phone)
    VALUES ($1, $2, $3, $4, $5);
  `;

  try {
    const userInfo = await pool.query(insertUserInfoQuery, insertUserInfoParams); // 쿼리문을 실행합니다.
    return response(baseResponse.SUCCESS, userInfo.rows); // 사용자 정보를 반환
  } catch (err) {
    console.error(err);
    return errResponse(baseResponse.SERVER_ERROR);
  }

  //return insertUserInfoRow;
}


module.exports = {
  insertUserInfo,
};
