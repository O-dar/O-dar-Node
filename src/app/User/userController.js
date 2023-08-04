const userProvider = require("./userProvider");
const userService = require("./userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

import bcrypt from "bcrypt";
const jwt = require('jsonwebtoken');
const { jwtMiddleware, generateToken } = require("../../../config/jwtMiddleware");
import { setCookie, deleteCookie } from "../../../utils/cookie.js";
//const regexEmail = require("regex-email");
//const {emit} = require("nodemon");

import pool from "../../../config/database.js";

const dayjs = require('dayjs');

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
	프로필 이미지(profile_img), 희망직종(job_id -> job_name), 희망요일, 희망시간,
	채용정보 알림 동의유무, 위치 알림 동의 유무, 위치 제공 동의 유무
*/
export const getUserInfo = async (req, res) => {
	//const client = await pool.connect(); // 클라이언트를 가져옵니다.
	//let accessToken = req.headers.authorization?.split(" ")[1];
	try {
		const id = res.locals.user.id;
    let userInfo = await userProvider.getUserById(id);
    userInfo = {
      // 필요한 정보만 추출
      //user_id: userInfo.user_id,
      name: userInfo.name,
      birthdate: userInfo.birthdate,
      
    };
		/*jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				
			} else {
				console.log("Access Token 유효");
				res.locals.accessToken = accessToken;
				
				res.locals.user = user;
				console.log(`jwtAuthorization 완료`);
				//console.log(user);
				return res.status(200).json({ user }); // Access Token 유효할 때도 next() 함수 호출
			}
		});*/
		
    return res.send(response(baseResponse.SUCCESS, { userInfo }));
	} catch (err) {
    console.error(err);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
}