const jobEduProvider = require("./jobEduProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

export const getJobEduList = async (req, res) => {
  try {
    // 페이지 크기
    let perPage = req.query.perPage;
    // 페이지 번호
    let page = req.query.page;

    // 페이지 크기가 없으면 10으로 설정
    if (perPage == undefined || typeof perPage == "undefined" || perPage == null) {
		perPage = 10;
	} else {
		perPage = parseInt(perPage);
	}

    // 페이지 번호가 없으면 0으로 설정
	if (page == undefined || typeof page == "undefined" || page == null) {
		page = 0;
	} else {
		page = parseInt(page);
	}

    const jobEduListResult = await jobEduProvider.retrieveJobEduList(perPage, page);

    return res.send(response(baseResponse.SUCCESS, jobEduListResult));
  } catch (error) {
    console.error(error);
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
};

export const getJobEduListCount = async (req, res) => {
    const jobEduListCountResult = await jobEduProvider.retrieveJobEduListCount();

    return res.send(response(baseResponse.SUCCESS, jobEduListCountResult));
};
