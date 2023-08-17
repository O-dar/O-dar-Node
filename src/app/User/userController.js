const userProvider = require("./userProvider");
const userService = require("./userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

import bcrypt from "bcrypt";
const jwt = require('jsonwebtoken');
const { jwtMiddleware, generateToken } = require("../../../config/jwtMiddleware");
import { setCookie, deleteCookie } from "../../../utils/cookie.js";
import { createRandomNumber } from "../../../utils/createCode"; 

const dayjs = require('dayjs');
const nodemailer = require('nodemailer');

/*
 01. 회원가입 API
 [POST] /app/users
*/
export const postUsers = async function (req, res) {
	try {
		// Body: email, password, name, phone, year, month, day
		const email = req.body.email;
		const password = req.body.password;
		const name = req.body.name;
		const phone = req.body.phone;

		const year = parseInt(req.body.year);
		const month = parseInt(req.body.month);
		const day = parseInt(req.body.day);

		// Validation
		// 1) 이메일: NOT null, 정규식
		// 이메일 null
		if(!email) {
			return res.send(errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
		}
		// 이메일 정규식 오류
		if(!checkValidationEmail(email)) {
			return res.send(errResponse(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
		}

		// 2) 비밀번호: NOT null, 정규식(특수문자(!, @, #, $, % , &, *), 대소문자, 숫자), 길이(8 ~ 15자)
		// 비밀번호 null
		if(!password) {
			return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
		}
		// 비밀번호 정규식, 길이 오류
		if(!checkValidationPassword(password)) {
			return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE));
		}

		// 3) 이름: NOT null, 10글자 미만 한글
		// 이름 null
		if(!name) {
			return res.send(errResponse(baseResponse.SIGNUP_NAME_EMPTY));
		}
		// 이름 길이 오류, 한글 아닌 경우
		if(!checkValidationName(name)) {
			return res.send(errResponse(baseResponse.SIGNUP_NAME_LENGTH));
		}

		// 4) 전화번호: NOT null, 정규식, 인증 유무
		// 전화번호 null
		if(!phone) {
			return res.send(errResponse(baseResponse.SIGNUP_PHONE_EMPTY));
		}
		// 전화번호 정규식
		if(!checkValidationPhone(phone)) {
			return res.send(errResponse(baseResponse.SIGNUP_PHONE_ERROR_TYPE));
		}

		// 인증 안 된 번호

		// 5) 생년월일: NOT null, 범위
		// 연도 null
		if(!year) {
			return res.send(errResponse(baseResponse.SIGNUP_YEAR_EMPTY));
		}
		// 월 null
		if(!month) {
			return res.send(errResponse(baseResponse.SIGNUP_MONTH_EMPTY));
		}
		// 일 null
		if(!day) {
			return res.send(errResponse(baseResponse.SIGNUP_DAY_EMPTY));
		}
		// 연, 월, 일 범위 오류
		if(year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) {
			return res.send(errResponse(baseResponse.SIGNUP_DAY_ERROR_TYPE));
		}

		// 날짜 연, 월, 일로 request 받은 거 date 형식으로 변환
		const d = new Date(year, month, day);
		const birthdate = dayjs(d).format('YYYY-MM-DD');

		const signUpResponse = await userService.createUser(
			email,
			password,
			name,
			birthdate,
			phone
		);

		return res.send(signUpResponse);
	} catch (error) {
		console.error(error);
		return res.send(errResponse(baseResponse.DB_ERROR));
	}
};

// 이메일 정규식 체크
const checkValidationEmail = ( email ) => {
	var pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    return (email.match(pattern) != null);
}

// 비밀번호 정규식 체크
const checkValidationPassword = ( password ) => {
	var pattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

    return (password.match(pattern) != null);
}

// 이름 정규식 체크
const checkValidationName = ( name ) => {
	var pattern = /^[가-힣]{1,10}$/;

    return (name.match(pattern) != null);
}

// 전화번호 정규식 체크
const checkValidationPhone = ( phone ) => {
	var pattern = /^\d{3}-\d{3,4}-\d{4}$/;

    return (phone.match(pattern) != null);
}

/*
 01 - 2. 회원탈퇴 API
 [DELETE] /app/users/delete
*/
export const deleteUsers = async function (req, res) {
	try {
		const id = res.locals.user.id; // 토큰에서 id 추출
		const user = await userProvider.getUserById(id);

		const email = req.body.email;
		const password = req.body.password;

		// 유저 존재? 확인
		if (!user) {
      return res.send(errResponse(baseResponse.USER_USEREMAIL_NOT_EXIST));
    }
		// 이메일이 일치하는지 확인
		if(user.email !== email) {
			return res.send(errResponse(baseResponse.SIGNIN_EMAIL_WRONG));
		}

    // 비밀번호가 일치하는지 확인합니다.
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_WRONG));
    }

		const deleteUserResponse = await userService.deleteUserService(id);
    deleteCookie(res);

		return res.send(deleteUserResponse);
	} catch (error) {
		console.error(error);
		return res.send(errResponse(baseResponse.DB_ERROR));
	}
};
/*
 02. 로그인 API
 [POST] /app/users/login
*/
export const login = async (req, res) => {
  // id와 password로 로그인하는 함수
  const email = req.body.email;
	const password = req.body.password;
	
  try {
    const user = await userProvider.getUserByEmail(email);
		//console.log(user);
    if (!user) {
      return res.send(errResponse(baseResponse.USER_USEREMAIL_NOT_EXIST));
    }

    // 비밀번호가 일치하는지 확인합니다.
    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
      return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_WRONG));
    }

    // 토큰을 생성합니다.
    const { accessToken } = await generateToken(user);
    
    // 토큰을 쿠키에 저장합니다.
    setCookie(res, "accessToken", accessToken);
    
    //console.log(`로그인 완료`);
		return res.send(response(baseResponse.SUCCESS, { accessToken }));
  } catch (err) {
    console.error(err);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
};

/*
 03. 로그아웃 API
 [POST] /app/users/logout
*/
export const logout = async (req, res) => {
	try {
		//const id = res.locals.user.id;
		deleteCookie(res);
		return res.send(response(baseResponse.SUCCESS, "로그아웃 되었습니다."));
	} catch (err) {
    console.error(err);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
}

/*
	04. 사용자 정보 조회API
	[GET] /app/users/info
	: 이름(name), 생년월일(birthdate), 지역(region_id -> province_name, city_name, region_name),
	프로필 이미지(profile_img), 희망직종(job_id -> job_name), 희망요일(want_days),
	희망 시작 시간(desire_start_time), 희망 종료 시간(desire_end_time),
	채용정보 알림 동의유무(job_notice), 위치 알림 동의 유무(place_notice), 위치 제공 동의 유무(place_provide)
*/
export const getUserInfo = async (req, res) => {
	//const client = await pool.connect(); // 클라이언트를 가져옵니다.
	//let accessToken = req.headers.authorization?.split(" ")[1];
	try {
		const TIME_ZONE = 9 * 60 * 60 * 1000;

		const id = res.locals.user.id;
    let userInfoById = await userProvider.getUserById(id);
		let birthdate = new Date(userInfoById.birthdate);

		// 생일로 만나이 계산
		const today = new Date();
		let age = today.getFullYear() - birthdate.getFullYear();
		const m = today.getMonth() - birthdate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
				age--;
		}
		//console.log(age);

    let userInfo = {
      // 필요한 정보만 추출
      name: userInfoById.name,
      age: age,
      profile_img: userInfoById.profile_img,
			want_days: userInfoById.want_days,
			desire_start_time: userInfoById.desire_start_time,
			desire_end_time: userInfoById.desire_end_time,
			job_notice: userInfoById.job_notice,
			place_notice: userInfoById.place_notice,
			place_provide: userInfoById.place_provide
    };

		let region_id = userInfoById.region_id
		let job_id = userInfoById.job_id

		const regionResponse = await userProvider.getRegionById(region_id);
		const jobResponse = await userProvider.getJobById(job_id);
		
    return res.send(response(baseResponse.SUCCESS, { userInfo, "region": regionResponse, "job": jobResponse }));
	} catch (err) {
    console.error(err);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
}

/*
	5. 아이디 찾기 API
	[GET] /app/users/email
	: 전화번호로 이메일 조회
*/
export const getUserEmail = async (req, res) => {
	try {
		const phone = req.body.phone;

		if(phone == null) {
			return res.send(errResponse(baseResponse.SIGNUP_PHONE_EMPTY));
		}

		const emailResponse = await userProvider.getEmailByPhone(phone);

		if(!emailResponse) {
			return res.send(errResponse(baseResponse.USER_USERPHONE_NOT_EXIST));
		}
		
    return res.send(response(baseResponse.SUCCESS, emailResponse ));
	} catch (err) {
    console.error(err);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
}

/*
	6. 아이디(이메일) 인증 API
	[GET] /app/users/check-email
*/
export const checkSignEmail = async (req, res) => {
	try {
		const email = req.body.email;
		
		// 이메일이 입력되지 않은 경우
		if(!email) {
			return res.send(errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
		}

		// 가입된 이메일이 아닌 경우
		const user = await userProvider.getUserByEmail(email);
    if (!user) {
      return res.send(errResponse(baseResponse.USER_USEREMAIL_NOT_EXIST));
    }

		// 가입된 이메일이라는 것이 확인 됨 ----------------------
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

		const verificationCode = createRandomNumber(6); // 인증 코드 (6자리 숫자)

		const questionEmail = await transporter.sendMail({
      from: `오다르(O-dar)`,
      to: email,
      subject: '오다르(O-dar) 이메일 인증',
      html: 
      `<div>
        <h3>오다르(O-dar) 이메일 인증 코드입니다.</h3>
				<p>아래 인증 코드를 O-dar 페이지에 입력하여 인증을 진행해주세요.</p>
        <br/>
        <p>[ ${verificationCode} ]</p>
      </div>`,
    });

		const result = `{"response": "인증번호가 발송되었습니다.", "code": "${verificationCode}"}`;

		return res.send(response(baseResponse.SUCCESS, JSON.parse(result)));
	} catch (err) {
    console.error(err);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
}

/*
	7. 비밀번호 찾기(변경) API
	[PATCH] /app/users/password
*/
export const changePassword = async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		// 이메일 null
		if(!email) {
			return res.send(errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
		}
		const user = await userProvider.getUserByEmail(email);
		//console.log(user);
    if (!user) {
      return res.send(errResponse(baseResponse.USER_USEREMAIL_NOT_EXIST));
    }

		// 2) 비밀번호: NOT null, 정규식(특수문자(!, @, #, $, % , &, *), 대소문자, 숫자), 길이(8 ~ 15자)
		// 비밀번호 null
		if(!password) {
			return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
		}
		// 비밀번호 정규식, 길이 오류
		if(!checkValidationPassword(password)) {
			return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE));
		}

		const changeEmail = await userService.changePassword(email, password);

		return res.send(response(baseResponse.SUCCESS, changeEmail ));
	} catch (err) {
    console.error(err);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
}

/*
	8. 사용자 정보 수정 API
	[PATCH] /app/users/edit
*/
export const changeUserInfo = async (req, res) => {
	try {
		const user_id = res.locals.user.id;
    let userInfoById = await userProvider.getUserById(user_id);

		// 사용자 정보
		let profile_img = req.body.profile_img;
		let want_days = req.body.want_days;
		let desire_start_time = req.body.desire_start_time;
		let desire_end_time = req.body.desire_end_time;
		let job_notice = req.body.job_notice;
		let place_notice = req.body.place_notice;
		let place_provide = req.body.place_provide;

		// 지역
		let region_id = null;
		const province = req.body.region_info.province;
    const city = req.body.region_info.city;
    const region = req.body.region_info.region;

		// 희망 직종
		let job_id = req.body.job_id;

		// request 값이 없는 것은 이전에 저장된 값으로 유지
		if(!profile_img) {
			profile_img = userInfoById.profile_img;
		}
		if(!want_days) {
			want_days = userInfoById.want_days;
		}
		if(!desire_end_time) {
			desire_end_time = userInfoById.desire_end_time;
		}
		if(!desire_start_time) {
			desire_start_time = userInfoById.desire_start_time;
		}
		if(job_notice == null) {
			job_notice = userInfoById.job_notice;
		}
		if(place_provide == null) {
			place_provide = userInfoById.place_provide
		}
		if(job_id == null) {
			job_id = userInfoById.job_id;
		}

		if(job_notice == 1 && place_provide == 1) 
			place_notice = 1;
		else place_notice = 0;

		// 지역 정보
		if(!province || !city || !region) {
			region_id = userInfoById.region_id;
		}
		else {
			// 지역 정보 입력값이 있고, 제공 동의 되었을 때
			if(place_provide == 1) {
				const getRegionByName = await userService.getOrAddRegion(province, city, region);
				//console.log(getRegionByName);
				region_id = getRegionByName.region_id;
			}
		}

		// 위치 정보 제공 동의 취소 시 지역 정보 삭제
		if(place_provide == 0) {
			region_id = null;
		}

		let userInfo = [
			profile_img,
			want_days,
			desire_start_time,
			desire_end_time,
  		job_notice,
			place_notice,
			place_provide,
			region_id,
			job_id,
			user_id
		];

		const changeInfo = await userService.changeUserInfo(userInfo);

		return res.send(response(baseResponse.SUCCESS, changeInfo ));
	} catch (err) {
    console.error(err);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
}