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
    return response(baseResponse.SUCCESS, "계정이 생성되었습니다."); // 사용자 정보를 반환
  } catch (err) {
    // Validation
    // 이메일 또는 전화번호가 중복되는 경우
    if(err.code == 23505) { 
      return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL_PHONE);
    }

    return errResponse(baseResponse.SERVER_ERROR);
  }

  //return insertUserInfoRow;
}

export const findUserById = async (client, id) => {
  const findUserByIdQuery = `SELECT * FROM users WHERE user_id = $1`; // id로 사용자 정보를 가져오는 쿼리문을 정의합니다.
  try {
    const userInfo = await client.query(findUserByIdQuery, [id]); // 쿼리문을 실행합니다.
    return userInfo.rows[0]; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  }
};

const findUserByEmail = async (client, email) => {
  const findUserByEmailQuery = `SELECT * FROM users WHERE email = $1`; // email로 사용자 정보를 가져오는 쿼리문을 정의합니다.
  try {
    const userInfo = await client.query(findUserByEmailQuery, [email]); // 쿼리문을 실행합니다.
    return userInfo.rows[0]; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  }
};


module.exports = {
  insertUserInfo,
  findUserById,
  findUserByEmail,
};
