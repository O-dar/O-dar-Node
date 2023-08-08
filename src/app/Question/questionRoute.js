module.exports = function(app){
	const question = require('./questionController');
	const { jwtMiddleware } = require("../../../config/jwtMiddleware");

	// 1. 문의사항 메일 전송 API
	app.post('/app/question', jwtMiddleware, question.sendQuestionEmail);
}