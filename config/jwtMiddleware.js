const jwt = require('jsonwebtoken');
const secret_config = require('./secret');
const { response } = require("./response")
const { errResponse } = require("./response")
const baseResponse = require("./baseResponseStatus");


const jwtMiddleware = (req, res, next) => {
  // 헤더의 accessToeken을 검증하는 미들웨어
  //req.clearCookie('accessToken').end();
  let accessToken = req.headers.authorization?.split(" ")[1];
  // 또는 쿠키의 accessToken 파싱
  /*if (!accessToken) {
    accessToken = req.cookies.accessToken;
  }*/
  // 그래도 없으면
  if (!accessToken) {
    console.log(`Access Token이 없습니다.`);
    return res.status(401).json({ message: "Access token not provided" });
  }

  // accessToken이 유효한지 확인
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      
    } else {
      console.log("Access Token 유효");
      res.locals.accessToken = accessToken;
      
      res.locals.user = user;
      console.log(`jwtAuthorization 완료`);
      //console.log(user);
      next(); // Access Token 유효할 때도 next() 함수 호출
    }
  });
};

export const generateToken = async (user) => {
    // 토큰을 생성하는 함수
    const accessToken = jwt.sign(
      { id: user.user_id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
  
    return { accessToken };
  };



module.exports = {
    jwtMiddleware,
    generateToken
};