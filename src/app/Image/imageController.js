const fs = require('fs');

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

export const upload = async (req, res) => {
  //console.log(req.file);
  if (!req.file) {
    return res.send(errResponse(baseResponse.IMAGE_UPLOAD));
  }
  let imageURL = "http://arthurcha.shop:3000/" + req.file.destination + req.file.filename;

  return res.send(response(baseResponse.SUCCESS,
    {
      file_info: req.file,
      img_url: imageURL
    }
  ));
}

exports.delete = (req, res) => {
  //USE ONLY SERVER
  if(req.ip != '127.0.0.1' && req.ip != 'localhost') {
    return res.status(401).json({message: "Permission denied"})
  }

  fs.unlink(`static/${req.body.filename}`, err => {
    if(err) {
      return res.status(402).json({message: "Image delete error"});
    }
    return res.status(200).json({message: "Image deleted"});
  });
}