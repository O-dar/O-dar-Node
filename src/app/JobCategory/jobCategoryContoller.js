const jobCategoryProvider = require("./jobCategoryProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

// 1. 직군 선택지 조회 API
export const getJobCategory = async function (req, res) {
	try {
    const getJobCategoryResponse = await jobCategoryProvider.getJobCategories();

    return res.send(getJobCategoryResponse);
	} catch (error) {
		console.error(error);
		return res.send(errResponse(baseResponse.DB_ERROR));
	}
}