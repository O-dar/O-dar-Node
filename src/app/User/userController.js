const userProvider = require("./userProvider");
const userService = require("./userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

//const jwtMiddleware = require("../../../config/jwtMiddleware");
//const regexEmail = require("regex-email");
//const {emit} = require("nodemon");

/*
 01. 회원가입 API
 [POST] /app/users
*/
export const postUsers = async function (req, res) {
    try {
        /*
        Body: email, password, name, birthdate, phone
        */
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const birthdate = new Date(req.body.birthdate);
        const phone = req.body.phone;

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
