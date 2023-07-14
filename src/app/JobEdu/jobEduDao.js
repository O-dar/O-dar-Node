const { logger } = require("../../../config/winston");
import pool from "../../../config/database";

export const selectJobEduList = async function () {
  const query = `
    select * from job_educations limit 3;
    `;

  try {
    const result = await pool.query(query);
    return result;
  } catch (error) {
    logger.error("쿼리 실패");
    throw error;
  }
};
