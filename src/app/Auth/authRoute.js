module.exports = function(app){
	const auth = require('./authController');

	// 1-1. 휴대폰 번호 인증(문자 발송)
	app.post('/app/auth/phone-send', auth.sendVerificationSMS);

	// 1-2. 휴대폰 번호 인증(인증 번호 확인)
	//app.post('/app/auth/phone-receive', auth.phoneReceive);
};