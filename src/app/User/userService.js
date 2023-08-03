import pool from "../../../config/database";
import hashPassword from "../../../utils/hashPassword";

const { logger } = require("../../../config/winston");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

import { setCookie, deleteCookie } from "../../../utils/cookie.js";
const jwt = require("jsonwebtoken");


// 회원가입: 사용자 생성
export const createUser = async function (email, password, name, birthdate, phone) {
    try {
        const insertUserInfoParams = [
            email,
            await hashPassword(password), // 비밀번호 해시화(암호화)
            name,
            birthdate,
            phone
        ];

        const userIdResult = await userDao.insertUserInfo(insertUserInfoParams);
        
        //return response(baseResponse.SUCCESS);
        return userIdResult;
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.code}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

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