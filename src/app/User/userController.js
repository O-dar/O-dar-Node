const userProvider = require("./userProvider");
const userService = require("./userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

//const jwtMiddleware = require("../../../config/jwtMiddleware");
//const regexEmail = require("regex-email");
//const {emit} = require("nodemon");

const dayjs = require('dayjs');

/*
 01. 회원가입 API
 [POST] /app/users
*/
export const postUsers = async function (req, res) {
    try {
        /*
        Body: email, password, name, phone, year, month, day
        */
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const phone = req.body.phone;

        const year = parseInt(req.body.year);
        const month = parseInt(req.body.month);
        const day = parseInt(req.body.day);

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
