import pool from "../../../config/database";

const { logger } = require("../../../config/winston");
const jobCategoryDao = require("./jobCategoryDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");


// 1. 직군 선택지 조회 API
export const getJobCategories = async function () {
    try {
        const jobCategoryResult = await jobCategoryDao.selectJobCategories();
        
        return jobCategoryResult;
    } catch (err) {
        logger.error(`App - getJobCategories Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};