module.exports = function(app){
	const notice = require('./noticeController');
	const { jwtMiddleware } = require("../../../config/jwtMiddleware");
  //const schedule = require('node-schedule');

	// 1. 알림 생성
	//app.listen(notice.addNotice);

	// 2. 알림 조회
	app.get('/app/notice', jwtMiddleware, notice.getNotices);
}