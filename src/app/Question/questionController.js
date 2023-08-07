const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const nodemailer = require('nodemailer');

// 1. 문의사항 메일 전송 API
export const sendQuestionEmail = async function (req, res) {
  const transporter = nodemailer.createTransport({
    // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
    service: 'gmail',
    auth: {
      // Gmail 주소
      user: process.env.QUESTION_FROM_EMAIL,
      // Gmail 패스워드
      pass: process.env.QUESTION_FROM_EMAIL_PASS,
    },
  });

  try {
    const questionText = req.body.question;
    
    const questionEmail = await transporter.sendMail({
      from: `오다르`,
      to: process.env.QUESTION_TO_EMAIL,
      subject: '오다르 문의사항',
      html: 
      `<div>
        <h2>오다르 사용자가 아래 내용을 문의했습니다.</h2>
        <br/>
        <p>${questionText}</p>
      </div>`,
    });

    return res.send(response(baseResponse.SUCCESS, "문의 메일이 전송되었습니다." ));
  } catch (error) {
		console.error(error);
		return res.send(errResponse(baseResponse.DB_ERROR));
	}
};