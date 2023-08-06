module.exports = {
  // Success
  SUCCESS: { isSuccess: true, code: 200, message: "성공" },

  // Common
  TOKEN_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "JWT 토큰을 입력해주세요.",
  },
  TOKEN_VERIFICATION_FAILURE: {
    isSuccess: false,
    code: 401,
    message: "JWT 토큰 검증 실패",
  },

  //Request error
  SIGNUP_EMAIL_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "이메일을 입력해주세요",
  },
  SIGNUP_EMAIL_LENGTH: {
    isSuccess: false,
    code: 400,
    message: "이메일은 30자리 미만으로 입력해주세요.",
  },
  SIGNUP_EMAIL_ERROR_TYPE: {
    isSuccess: false,
    code: 400,
    message: "이메일 형식을 정확하게 입력해주세요.",
  },
  SIGNUP_PASSWORD_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "비밀번호를 입력 해주세요.",
  },
  SIGNUP_PASSWORD_ERROR_TYPE: {
    isSuccess: false,
    code: 400,
    message:
      "비밀번호는 특수문자(!, @, #, $, % , &, *), 대소문자, 숫자를 포함하여 8~15자로 입력해주세요.",
  },
  SIGNUP_NAME_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "이름을 입력해주세요.",
  },
  SIGNUP_NAME_LENGTH: {
    isSuccess: false,
    code: 400,
    message: "이름은 10자리 미만의 한글로 입력해주세요.",
  },
  SIGNUP_PHONE_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "전화번호를 입력해주세요.",
  },
  SIGNUP_PHONE_ERROR_TYPE: {
    isSuccess: false,
    code: 400,
    message: "전화번호 형식을 정확하게 입력해주세요.",
  },
  SIGNUP_YEAR_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "생년월일의 연도(year)를 입력해주세요.",
  },
  SIGNUP_MONTH_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "생년월일의 월(month)를 입력해주세요.",
  },
  SIGNUP_DAY_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "생년월일의 일(day)을 입력해주세요.",
  },
  SIGNUP_DAY_ERROR_TYPE: {
    isSuccess: false,
    code: 400,
    message: "생년월일의 연, 월, 일 범위를 정확하게 입력해주세요.",
  },

  SIGNIN_EMAIL_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "이메일을 입력해주세요",
  },
  SIGNIN_EMAIL_LENGTH: {
    isSuccess: false,
    code: 400,
    message: "이메일은 30자리 미만으로 입력해주세요.",
  },
  SIGNIN_EMAIL_ERROR_TYPE: {
    isSuccess: false,
    code: 400,
    message: "이메일을 형식을 정확하게 입력해주세요.",
  },
  SIGNIN_PASSWORD_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "비밀번호를 입력 해주세요.",
  },

  USER_USERID_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "userId를 입력해주세요.",
  },
  USER_USERID_NOT_EXIST: {
    isSuccess: false,
    code: 404,
    message: "해당 회원이 존재하지 않습니다.",
  },

  USER_USEREMAIL_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "이메일을 입력해주세요.",
  },
  USER_USEREMAIL_NOT_EXIST: {
    isSuccess: false,
    code: 404,
    message: "해당 이메일을 가진 회원이 존재하지 않습니다.",
  },
  USER_USERPHONE_NOT_EXIST: {
    isSuccess: false,
    code: 404,
    message: "해당 전화번호로 가입된 회원이 존재하지 않습니다.",
  },
  USER_USEREMAIL_NOT_EQEAL: {
    isSuccess: false,
    code: 404,
    message: "이메일이 일치하지 않습니다.",
  },
  USER_ID_NOT_MATCH: {
    isSuccess: false,
    code: 401,
    message: "유저 아이디 값을 확인해주세요",
  },
  USER_NICKNAME_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "변경할 닉네임 값을 입력해주세요",
  },

  USER_STATUS_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "회원 상태값을 입력해주세요",
  },

  // Response error
  SIGNUP_REDUNDANT_EMAIL_PHONE: {
    isSuccess: false,
    code: 400,
    message: "이미 해당 이메일 또는 전화번호로 가입된 정보가 있습니다.",
  },
  SIGNUP_REDUNDANT_NICKNAME: {
    isSuccess: false,
    code: 400,
    message: "중복된 닉네임입니다.",
  },

  SIGNIN_EMAIL_WRONG: {
    isSuccess: false,
    code: 404,
    message: "이메일이 잘못 되었습니다.",
  },
  SIGNIN_PASSWORD_WRONG: {
    isSuccess: false,
    code: 404,
    message: "비밀번호가 잘못 되었습니다.",
  },
  SIGNIN_INACTIVE_ACCOUNT: {
    isSuccess: false,
    code: 400,
    message: "비활성화 된 계정입니다. 고객센터에 문의해주세요.",
  },
  SIGNIN_WITHDRAWAL_ACCOUNT: {
    isSuccess: false,
    code: 400,
    message: "탈퇴 된 계정입니다. 고객센터에 문의해주세요.",
  },

  IMAGE_UPLOAD: {
    isSuccess: false,
    code: 400,
    message:
      "이미지 업로드 에러입니다. 파일이 제대로 요청되었는지 확인해주세요.",
  },

  //Connection, Transaction 등의 서버 오류
  DB_ERROR: { isSuccess: false, code: 500, message: "데이터 베이스 에러" },
  SERVER_ERROR: { isSuccess: false, code: 500, message: "서버 에러" },

  // JobPosting
  JOBPOSTING_ID_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "jobPostingId를 입력해주세요.",
  },
  JOBPOSTING_ID_NOT_EXIST: {
    isSuccess: false,
    code: 404,
    message: "해당 구직공고가 존재하지 않습니다.",
  },
  JOBPOSTING_SEARCH_EMPTY: {
    isSuccess: false,
    code: 404,
    message: "검색 결과가 없습니다.",
  },

  // JobApply
  APPLYID_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "applyId를 입력해주세요.",
  },

  APPLYID_NOT_EXIST: {
    isSuccess: false,
    code: 404,
    message: "해당 지원내역이 존재하지 않습니다.",
  },

  APPLY_ALREADY_EXIST: {
    isSuccess: false,
    code: 404,
    message: "이미 지원한 구직공고입니다.",
  },
};
