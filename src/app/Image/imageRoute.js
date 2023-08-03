module.exports = function(app){
	const image = require('./imageController');
  const upload = require('./setMulter');
	const { jwtMiddleware } = require("../../../config/jwtMiddleware");

	// 1. 프로필 이미지 업로드(이미지 서버에 업로드) API
	app.post('/app/image', jwtMiddleware, upload.single('img'), image.upload);
};
