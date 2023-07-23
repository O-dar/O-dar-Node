module.exports = function(app){
	const jobCategory = require('./jobCategoryContoller');

	// 1. 직군 선택지 조회 API
	app.get('/app/job-category', jobCategory.getJobCategory);
};