module.exports = function (app) {
  const jobPosting = require("./jobPostingController");

  // 1. 구직공고 목록 API
  app.get("/app/jobPosting", jobPosting.getjobPostingList);

  // 3. 구직공고 검색 API
  app.get("/app/jobPosting/search", jobPosting.getJobPostingBySearch);

  // 2. 구직공고 상세 조회 API
  app.get("/app/jobPosting/:jobPostingId(\\d+)", jobPosting.getJobPostingById);

  /*
  내부 사용 API
    */

  // 구직공고 목록 개수 API
  app.get("/app/jobPosting/count", jobPosting.getJobPostingListCount);
  // 지역명 지역 id로 변환
  app.get("/app/jobPosting/region", jobPosting.regionToregionId);
  // 읍면동으로 중심 좌표 계산
  app.get("/app/jobPosting/center", jobPosting.getCenter);
};
