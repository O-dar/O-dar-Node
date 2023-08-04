module.exports = function(app){
	const user = require('./userController');
	const { jwtMiddleware } = require("../../../config/jwtMiddleware");

	// 1. 유저 생성 (회원가입) API
	app.post('/app/users', user.postUsers);

	// 2. 로그인 API
	app.post('/app/users/login', user.login);

	// 3. 사용자 정보 조회 API
	app.get('/app/users/info', jwtMiddleware, user.getUserInfo);
};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API