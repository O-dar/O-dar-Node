import pool from "../../../config/database";
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// email로 사용자 정보를 가져오는 함수를 정의합니다.
export const getUserByEmail = async (email) => {
  const client = await pool.connect(); // 클라이언트를 가져옵니다.
  try {
    const userInfo = await userDao.findUserByEmail(client, email); // 사용자 정보를 가져옵니다.
    if (!userInfo) {
      return null;
    }
    return userInfo; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  } finally {
    client.release(); // 클라이언트를 반납합니다.
  }
};

// id로 사용자 정보를 가져오는 함수를 정의합니다.
export const getUserById = async (id) => {
  const client = await pool.connect(); // 클라이언트를 가져옵니다.
  try {
    const userInfo = await userDao.findUserById(client, id); // 사용자 정보를 가져옵니다.
    if (!userInfo) {
      return null;
    }
    return userInfo; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  } finally {
    client.release(); // 클라이언트를 반납합니다.
  }
};