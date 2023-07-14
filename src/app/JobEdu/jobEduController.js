const jobEduProvider = require("./jobEduProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

export const getJobEduList = async (req, res) => {
    try {
      const jobEduListResult = await jobEduProvider.retrieveJobEduList();
  
      return res.send(response(baseResponse.SUCCESS, jobEduListResult));
    } catch (error) {
      console.error(error);
      return res.send(errResponse(baseResponse.DB_ERROR));
    }
  };