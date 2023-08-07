const { logger } = require("../../../config/winston");
import pool from "../../../config/database";
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");


//insertUserInfoParams
// 유저 생성
async function insertUserInfo(insertUserInfoParams) {
  const insertUserInfoQuery = `
    INSERT INTO users (email, password, name, birthdate, phone)
    VALUES ($1, $2, $3, $4, $5);
  `;

  try {
    const userInfo = await pool.query(insertUserInfoQuery, insertUserInfoParams); // 쿼리문을 실행합니다.
    return response(baseResponse.SUCCESS, "계정이 생성되었습니다."); // 사용자 정보를 반환
  } catch (err) {
    // Validation
    // 이메일 또는 전화번호가 중복되는 경우
    if(err.code == 23505) { 
      return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL_PHONE);
    }

    return errResponse(baseResponse.SERVER_ERROR);
  }

  //return insertUserInfoRow;
}

// 회원탈퇴: 사용자 삭제
async function deleteUserById(id) {
  const deleteUserByIdQuery = `DELETE FROM users WHERE user_id = $1`;
  try {
    const deleteUser = await pool.query(deleteUserByIdQuery, [id]); // 쿼리문을 실행합니다.

    return response(baseResponse.SUCCESS, "계정이 삭제되었습니다.");
  } catch (err) {
    console.error(err);
    return errResponse(baseResponse.SERVER_ERROR);
  }
}

export const findUserById = async (client, id) => {
  const findUserByIdQuery = `SELECT * FROM users WHERE user_id = $1`; // id로 사용자 정보를 가져오는 쿼리문을 정의합니다.
  try {
    const userInfo = await client.query(findUserByIdQuery, [id]); // 쿼리문을 실행합니다.
    return userInfo.rows[0]; // 사용자 정보를 반환합니다.
  } catch (err) {
    return errResponse(baseResponse.SERVER_ERROR);
  }
};

const findUserByEmail = async (client, email) => {
  const findUserByEmailQuery = `SELECT * FROM users WHERE email = $1`; // email로 사용자 정보를 가져오는 쿼리문을 정의합니다.
  try {
    const userInfo = await client.query(findUserByEmailQuery, [email]); // 쿼리문을 실행합니다.
    return userInfo.rows[0]; // 사용자 정보를 반환합니다.
  } catch (err) {
    return errResponse(baseResponse.SERVER_ERROR);
  }
};

// region_id로 지역 정보 가져오기
const findRegionById = async (region_id) => {
  const findRegionByIdQuery = `SELECT region_name, city_id FROM regions WHERE region_id = $1`;
  const findCityByIdQuery = `SELECT city_name, province_id FROM city WHERE city_id = $1`;
  const findProvinceByIdQuery = `SELECT province_name FROM province WHERE province_id = $1`;
  try {
    let region = null;
    let city = null;
    let province = null;

    if(region_id) {
      const regionInfo = await pool.query(findRegionByIdQuery, [region_id]);
      //console.log(regionInfo.rows[0].region_name);
      region = regionInfo.rows[0].region_name;

      if(regionInfo.rows[0].city_id) {
        const cityInfo = await pool.query(findCityByIdQuery, [regionInfo.rows[0].city_id]);
        //console.log(cityInfo.rows[0].city_name);
        city = cityInfo.rows[0].city_name;

        if(cityInfo.rows[0].province_id) {
          const provinceInfo = await pool.query(findProvinceByIdQuery, [cityInfo.rows[0].province_id]);
          //console.log(provinceInfo.rows[0].province_name);
          province = provinceInfo.rows[0].province_name;
        }
      }
    }
    
    const result = {
      "province": province,
      "city": city,
      "region": region,
    }

    return result;
  } catch (err) {
    return errResponse(baseResponse.SERVER_ERROR);
  }
}

// job_id로 희망 직종 정보 가져오기
const findJobById = async (job_id) => {
  const findJobByIdQuery = `SELECT job_name FROM job_categories WHERE job_id = $1`;
  try {
    let job = null;

    if(job_id) {
      const jobInfo = await pool.query(findJobByIdQuery, [job_id]);
      if(jobInfo.rows[0] != null)
        job = jobInfo.rows[0].job_name;
    }

    return job;
  } catch (err) {
    return errResponse(baseResponse.SERVER_ERROR);
  }
}

// 전화번호로 아이디(이메일) 조회
const findEmailByPhone = async (phone) => {
  const findEmailByPhoneQuery = `SELECT email FROM users WHERE phone = $1`;
  try {
    let email = null;

    if(phone) {
      const emailInfo = await pool.query(findEmailByPhoneQuery, [phone]);
      if(emailInfo.rows[0] != null)
        email = emailInfo.rows[0];
    }

    return email;
  } catch (err) {
    return errResponse(baseResponse.SERVER_ERROR);
  }
}

// 비밀번호 변경
const patchPasswordByEmail = async (email, password) => {
  const patchPasswordByEmailQuery = `UPDATE users SET password = $1, updated_at = $3 WHERE email = $2;`;
  const timeQuery = `SELECT NOW()`;
  try {
    let timestamp = await pool.query(timeQuery);
    const emailInfo = await pool.query(patchPasswordByEmailQuery, [password, email, timestamp.rows[0].now]);
    //console.log(emailInfo);

    return "비밀번호가 변경 되었습니다.";
  } catch (err) {
    return errResponse(baseResponse.SERVER_ERROR);
  }
}

// 지역 정보 추가 또는 조회
const getOrAddRegionId = async (province, city, region) => {
  // 조회
  const findProvinceByNameQuery = `SELECT province_id FROM province WHERE province_name = $1`;
  const findCityByNameQuery = `SELECT city_id FROM city WHERE province_id = $1 AND city_name = $2`;
  const findRegionByNameQuery = `SELECT region_id FROM regions WHERE city_id = $1 AND region_name = $2`;
  
  // 추가
  const insertProvinceQuery = `INSERT INTO province (province_name) VALUES ($1)`;
  const insertCityQuery = `INSERT INTO city (province_id, city_name) VALUES ($1, $2)`;
  const insertRegionQuery = `INSERT INTO regions (city_id, region_name) VALUES ($1, $2)`;

  try {
    let province_id = await pool.query(findProvinceByNameQuery, [province]);
    
    if(province_id.rows[0] == null) {
      await pool.query(insertProvinceQuery, [province]);
      province_id = await pool.query(findProvinceByNameQuery, [province]);
      province_id = province_id.rows[0].province_id;
    }
    else {
      province_id = province_id.rows[0].province_id;
    }

    let city_id = await pool.query(findCityByNameQuery, [province_id, city]);
    if(city_id.rows[0] == null) {
      await pool.query(insertCityQuery, [province_id, city]);
      city_id = await pool.query(findCityByNameQuery, [province_id, city]);
      city_id = city_id.rows[0].city_id;
    }
    else {
      city_id = city_id.rows[0].city_id;
    }

    let region_id = await pool.query(findRegionByNameQuery, [city_id, region]);
    if(region_id.rows[0] == null) {
      await pool.query(insertRegionQuery, [city_id, region]);
      region_id = await pool.query(findRegionByNameQuery, [city_id, region]);
      region_id = region_id.rows[0].region_id;
    }
    else {
      region_id = region_id.rows[0].region_id;
    }

    return { province_id, city_id, region_id };
  } catch (err) {
    return errResponse(baseResponse.SERVER_ERROR);
  }
}

// 사용자 정보 수정
const patchUserInfo = async (userInfo) => {
  const patchhUserInfo = `UPDATE users
  SET profile_img = $1,
  want_days = $2,
  desire_start_time = $3,
  desire_end_time = $4,
  job_notice = $5,
  place_notice = $6,
  place_provide = $7,
  region_id = $8,
  job_id = $9,
  updated_at = $11
  WHERE user_id = $10;`;

  const timeQuery = `SELECT NOW()`;

  try {
    let timestamp = await pool.query(timeQuery);
    userInfo[10] = timestamp.rows[0].now;
    let patchUserInfoResult = await pool.query(patchhUserInfo, userInfo);

    return "사용자 프로필 정보가 변경되었습니다.";
  } catch (err) {
    return errResponse(baseResponse.SERVER_ERROR);
  }
}

module.exports = {
  insertUserInfo,
  deleteUserById,
  findUserById,
  findUserByEmail,
  findRegionById,
  findJobById,
  findEmailByPhone,
  patchPasswordByEmail,
  getOrAddRegionId,
  patchUserInfo
};
