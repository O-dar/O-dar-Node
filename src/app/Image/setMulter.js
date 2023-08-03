// Multer 사전 설정

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // 이미지 => 정적파일로 제공을 위해 static 폴더에 저장
    callback(null, 'static/');
  },
  filename: (req, file, callback) => {
    let fileName = file.originalname;

    for(let i = fileName.length - 1;i >= 0;i--) {
      if(fileName[i] == '.') {
        // 파일명을 '기존 파일 명 + 현재시간 + 확장자' 로 설정
        fileName = fileName.slice(0, i) + '_' + Date.now() + fileName.slice(i);
        break;
      }
    }
    callback(null, fileName);
  }
})
const upload = multer({storage: storage});

module.exports = upload;