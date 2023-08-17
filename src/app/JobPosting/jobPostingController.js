const jobPostingProvider = require("./jobPostingProvider");
const jobPostingDao = require("./jobPostingDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
import dotenv from "dotenv";
dotenv.config();

// 채용공고 목록 조회
export const getjobPostingList = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 11;
    const active_status = req.query.active_status;

    const jobPostingListResult =
      await jobPostingProvider.retrieveJobPostingList(
        pageSize,
        page,
        active_status
      );

    return res.send(response(baseResponse.SUCCESS, jobPostingListResult));
  } catch (error) {
    console.error(error);
    if (error.message === "Page out of bounds") {
      return res.send(errResponse(baseResponse.PAGE_OUT_OF_BOUNDS_ERROR));
    }
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
};

// 채용공고 목록 개수 조회
export const getJobPostingListCount = async (req, res) => {
  const jobPostingListCountResult =
    await jobPostingProvider.retrieveJobPostingListCount();

  return res.send(response(baseResponse.SUCCESS, jobPostingListCountResult));
};

export const getJobPostingById = async (req, res) => {
  const jobPostingId = req.params.jobPostingId;

  // 해당 id 의 구직공고가 없으면 에러
  if (!jobPostingId)
    return res.send(errResponse(baseResponse.JOBPOSTING_ID_EMPTY));

  const jobPostingByIdResult = await jobPostingProvider.retrieveJobPostingById(
    jobPostingId
  );
  if (!jobPostingByIdResult) {
    return res.send(errResponse(baseResponse.JOBPOSTING_ID_NOT_EXIST));
  }

  return res.send(response(baseResponse.SUCCESS, jobPostingByIdResult));
};

// 채용공고 키워드 검색
export const getJobPostingBySearch = async (req, res) => {
  const keyword = req.query.keyword;
  const page = req.query.page || 1; // 페이지 번호가 주어지지 않은 경우 기본값은 1
  const pageSize = req.query.pageSize || 11; // 페이지 크기가 주어지지 않은 경우 기본값은 11
  const active_status = req.query.active_status;

  // 키워드가 없으면 에러
  if (!keyword) {
    return res.status(400).json({ error: "keyword is required" });
  }

  try {
    const data = await jobPostingProvider.searchWithPagination(
      keyword,
      page,
      pageSize,
      active_status
    );
    return res.send(response(baseResponse.SUCCESS, data));
  } catch (err) {
    if (err.message === "No search results") {
      return res.send(errResponse(baseResponse.JOBPOSTING_SEARCH_EMPTY));
    }
    if (err.message === "Page out of bounds") {
      return res.send(errResponse(baseResponse.PAGE_OUT_OF_BOUNDS_ERROR));
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

// 지역이름 id로 바꾸기
export const regionToregionId = async (req, res) => {
  // job_postings 테이블에 있는 모든 데이터를 가져온다.
  const jobPostingList = await jobPostingDao.selectAllJobPosting();
  jobPostingList.forEach(async (row) => {
    const region = row.region_id;
    let region_id2;
    // region_id 가 4글자 이하이고 읍/면/동 으로 끝나면
    if (region.length <= 4 && region.endsWith("읍")) {
      // regions 테이블에서 해당 지역명을 찾아서 region_id2 로 바꾼다.
      region_id2 = await jobPostingDao.selectRegionIdByRegionName(region);
    } else if (region.length <= 4 && region.endsWith("면")) {
      region_id2 = await jobPostingDao.selectRegionIdByRegionName(region);
    } else if (region.length <= 4 && region.endsWith("동")) {
      region_id2 = await jobPostingDao.selectRegionIdByRegionName(region);
    } else {
      // 그 외에는 8번(기타)으로 바꾼다.
      region_id2 = 8;
    }
    // region_id2 로 바꾼다.
    const result = await jobPostingDao.updateRegionId(
      row.job_posting_id,
      region_id2
    );
    console.log(result);
  });
  return res.send(response(baseResponse.SUCCESS));
};

// 읍면동으로 중심 좌표 계산
export const getCenter = async (req, res) => {
  // regions 테이블에 있는 모든 데이터를 가져온다.
  const regionList = await jobPostingDao.selectAllRegions();
  // 데이터에 위도,경도를 추가한다
  regionList.forEach(async (row) => {
    // regionName == "기타" 이면 continue
    if (row.city_id !== 4) {
      return;
    }
    const regionName = "진주시 " + row.region_name;
    console.log(regionName);

    // API 호출
    const axios = require("axios");
    const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${regionName}`;
    const config = {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET,
      },
    };
    try {
      const response = await axios.get(url, config);
      const data = response.data;
      const latitute = data.addresses[0].y;
      const longitute = data.addresses[0].x;

      // 위도,경도를 regions 테이블에 업데이트 한다.
      const result = await jobPostingDao.updateCenter(
        row.region_id,
        latitute,
        longitute
      );
      console.log(result);
    } catch (error) {
      console.log(error);
      console.log(url);
    }
  });
  return res.send(response(baseResponse.SUCCESS));
};

// 거리별 필터 조회
export const getJobPostingByRegion = async (req, res) => {
  // 1. 유저의 region_id 를 받아서 위도, 경도를 구한다.
  const user_id = res.locals.user.id;
  // json 형태로 반환
  const region_data = await jobPostingDao.selectRegionByUserId(user_id);
  if (!region_data || region_data.region_id === null) {
    return res.send(errResponse(baseResponse.REGION_ID_NOT_EXIST));
  }
  const lat = region_data.latitude;
  const lng = region_data.longitude;

  // 2. Haversine 공식을 이용해 유저의 위치와 각 구직공고의 위치 사이의 거리를 계산
  function toRadians(degree) {
    return degree * (Math.PI / 180);
  }

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 지구의 반지름 (킬로미터 단위)

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // 거리 (킬로미터 단위)

    return distance;
  }

  // regions 테이블의 지역들의 위도,경도를 가져온다.
  const regionList = await jobPostingDao.selectAllRegions();

  // 제일 짧은거리 3개를 반환한다.
  // 거리 계산 및 region 정보 저장을 위한 배열 생성
  let distances = [];

  for (const region of regionList) {
    if (!region.latitude || !region.longitude) {
      continue;
    }
    const distance = haversineDistance(
      lat,
      lng,
      region.latitude,
      region.longitude
    );

    // 계산한 거리와 해당 region 정보를 함께 저장
    distances.push({
      region: region,
      distance: distance,
    });
  }

  // 거리를 기준으로 오름차순 정렬
  distances.sort((a, b) => a.distance - b.distance);

  // 상위 3개의 region 선택
  const top3Regions = distances.slice(0, 5);
  // region_id 만 추출
  top3Regions.forEach((region) => {
    region.region_id = region.region.region_id;
    delete region.region;
  });

  console.log(top3Regions);
  // 채용공고에서 top3Regions 에 해당하는 region_id 를 가진 채용공고를 순위 순서대로 반환
  const jobPostingByRegion = await jobPostingDao.selectJobPostingByRegion(
    top3Regions
  );
  console.log(jobPostingByRegion);
  res.send(response(baseResponse.SUCCESS, jobPostingByRegion));
};
