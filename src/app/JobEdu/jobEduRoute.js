module.exports = function(app){
    const jobEdu = require('./jobEduController');

    // 1. 취업교육 목록 API
    app.get('/app/jobEdu', jobEdu.getJobEduList);

};