import pool from "../../../config/database";
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

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

// region_id로 지역 정보 가져오기
export const getRegionById = async (region_id) => {
  try {
    const regionInfo = await userDao.findRegionById(region_id);
    if (!regionInfo) {
      return null;
    }
    return regionInfo;
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.code}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

// job_id로 희망 직종 정보 가져오기
export const getJobById = async (job_id) => {
  try {
    const jobInfo = await userDao.findJobById(job_id);
    if (!jobInfo) {
      return null;
    }
    return jobInfo;
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.code}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

// 전화번호로 사용자 아이디(email) 조회
export const getEmailByPhone = async (phone) => {
  try {
    const email = await userDao.findEmailByPhone(phone);
    if (!email) {
      return null;
    }
    return email;
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.code}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}