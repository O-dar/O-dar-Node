module.exports = function(app){
    const jobEdu = require('./jobEduController');

    // 1. 취업교육 목록 API
    app.get('/app/jobEdu', jobEdu.getJobEduList);


    
    // 취업지원 목록 개수 API
    app.get('/app/jobEdu/count', jobEdu.getJobEduListCount)

};