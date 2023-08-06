module.exports = function (app) {
  const { jwtMiddleware } = require("../../../config/jwtMiddleware");
  const jobApply = require("./jobApplyController");

  // 1. 구직공고 지원내역 조회 API
  app.get("/app/jobApply", jwtMiddleware, jobApply.getJobApplyList);

  // 2. 구직공고 지원내역 추가 API
  app.post("/app/jobApply", jwtMiddleware, jobApply.createJobApply);

  // 3. 구직공고 지원내역 삭제 API
  app.delete(
    "/app/jobApply/:applyId(\\d+)",
    jwtMiddleware,
    jobApply.deleteJobApply
  );
};
