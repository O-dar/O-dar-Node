import pool from "../../../config/database";

const { logger } = require("../../../config/winston");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");


//const jwt = require("jsonwebtoken");
//const crypto = require("crypto");


// 회원가입: 사용자 생성
export const createUser = async function (email, password, name, birthdate, phone) {
    try {
        const insertUserInfoParams = [email, password, name, birthdate, phone];

        //const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(insertUserInfoParams);
        //console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        
        //return response(baseResponse.SUCCESS);
        return userIdResult;
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};