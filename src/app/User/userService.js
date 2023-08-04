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

// 회원탈퇴: 사용자 삭제
export const deleteUserService = async function (id) {
  try {
    const deleteUserIdResult = await userDao.deleteUserById(id);

    return deleteUserIdResult;
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.code}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}
