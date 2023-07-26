const authProvider = require("./authProvider");
const authService = require("./authService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const CryptoJS = require("crypto-js");
const axios = require("axios");

export const sendVerificationSMS = async function (req, res) {
  try {
    const tel = req.body.phone;
    const user_phone_number = tel.split("-").join(""); // SMS를 수신할 전화번호
    const verificationCode = createRandomNumber(6); // 인증 코드 (6자리 숫자)
    const date = Date.now().toString(); // 날짜 string

    // 환경 변수
    const sens_service_id = process.env.NCP_SERVICE_ID;
    const sens_access_key = process.env.NCP_API_ACCESS;
    const sens_secret_key = process.env.NCP_API_SECRET;
    const sens_call_number = process.env.NCP_SENS_NUMBER;

    // url 관련 변수 선언
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${sens_service_id}/messages`;
    const url2 = `/sms/v2/services/${sens_service_id}/messages`;

    // signature 작성 : crypto-js 모듈을 이용하여 암호화
    console.log(1);
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, sens_secret_key);
    console.log(2);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    console.log(sens_access_key);
    hmac.update(sens_access_key);
    const hash = hmac.finalize();
    console.log(4);
    const signature = hash.toString(CryptoJS.enc.Base64);
    console.log(5);

    // sens 서버로 요청 전송
    const smsRes = await axios({
      method: method,
      url: url,
      headers: {
        "Contenc-type": "application/json; charset=utf-8",
        "x-ncp-iam-access-key": sens_access_key,
        "x-ncp-apigw-timestamp": date,
        "x-ncp-apigw-signature-v2": signature,
      },
      data: {
        type: "SMS",
        countryCode: "82",
        from: sens_call_number,
        content: `인증번호는 [${verificationCode}] 입니다.`,
        messages: [{ to: `${user_phone_number}` }],
      },
    });
    console.log("response", smsRes.data);

    const result = `{"response": "인증번호가 발송되었습니다.", "code": "${verificationCode}"}`;

    return res.send(response(baseResponse.SUCCESS, JSON.parse(result)));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
}

const createRandomNumber = (count) => {
  let code = ""
  for(let i = 0; i < count; i++) {
    code += Math.floor(Math.random() * 10);
  }

  return code;
}