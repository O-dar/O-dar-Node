const { logger } = require("../../../config/winston");
import pool from "../../../config/database";


//insertUserInfoParams
// 유저 생성
async function insertUserInfo(insertUserInfoParams) {
  const insertUserInfoQuery = `
    SELECT * FROM job_categories;
  `;
  /*
  INSERT INTO users (email, password, name, birthdate, phone)
      VALUES (?, ?, ?, ?, ?);
  */
  /*const insertUserInfoRow = await connection.query(
    insertUserInfoQuery
  );*/

  try {
    const userInfo = await pool.query(insertUserInfoQuery); // 쿼리문을 실행합니다.
    return userInfo.rows; // 사용자 정보를 반환
  } catch (err) {
    console.error(err);
  }

  //return insertUserInfoRow;
}


module.exports = {
  insertUserInfo,
};
