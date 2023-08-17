const noticeProvider = require("./noticeProvider");
const noticeService = require("./noticeService");

const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const schedule = require('node-schedule');

// 1. 알림 생성
export const addNotice = () => {
  // 매일 00시 00분 00초에 새로운 알림 추가
  schedule.scheduleJob('0 0 0 * * *', async () => {
    const addNotice = await noticeService.addNewNotice();

    // console.log(addNotice);
  });
}

// 2. 알림 조회
export const getNotices = async (req, res) => {
	try {
    const user_id = res.locals.user.id;

    const noticeList = await noticeProvider.getNoticeForUser(user_id);

    return res.send(noticeList);
  } catch (err) {
    console.error(err);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
}