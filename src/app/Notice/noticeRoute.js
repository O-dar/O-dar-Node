module.exports = function(app){
	const notice = require('./noticeController');
	const { jwtMiddleware } = require("../../../config/jwtMiddleware");

	// 1. 유저 생성 (회원가입) API
	//app.post('/app/users', user.postUsers);
}