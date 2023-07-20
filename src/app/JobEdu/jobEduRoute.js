module.exports = function (app) {
  const jobEdu = require("./jobEduController");

  // 1. 취업교육 목록 API
  app.get("/app/jobEdu", jobEdu.getJobEduList);

  // 2. 취업교육 상세 조회 API
  app.get("/app/jobEdu/:jobEduId", jobEdu.getJobEduById);

    


  /*
  내부 사용 API
    */

  // 취업지원 목록 개수 API
  app.get("/app/jobEdu/count", jobEdu.getJobEduListCount);
};
