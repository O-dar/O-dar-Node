const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');
module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());

    app.use('/static', express.static('static'));
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    // 도메인
    require('../src/app/User/userRoute')(app);
    require('../src/app/Auth/authRoute')(app);
    require('../src/app/Image/imageRoute')(app);
    require('../src/app/JobCategory/jobCategoryRoute')(app);
    require('../src/app/Question/questionRoute')(app);

    return app;
};