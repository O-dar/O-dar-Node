import pool from "../../../config/database";
const jobEduDao = require("./jobEduDao");

const { logger } = require("../../../config/winston");

export const retrieveJobEduList = async function () {
    try {
      const result = await jobEduDao.selectJobEduList();
      return result;
    } catch (error) {
      logger.error("DB 연결 실패");
      throw error;
    }
  };
  