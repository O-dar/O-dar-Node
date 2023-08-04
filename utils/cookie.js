export const setCookie = (res, name, value) => {
  res.cookie(name, value, {
    // httpOnly: true,  // 자바스크립트에서 못쓰게
    // secure: true,
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15일 후 만료
  });
};

export const deleteCookie = (res) => {
  const cookieOptions = {
    expires: new Date(0),
    // httpOnly: true,
  };

  console.log("--------------------------------------------");
  console.log(res);
  //res.clearCookie('accessToken');
  //res.clearCookie('user').end();
  res.cookie("accessToken", "", cookieOptions);
  //res.cookie("refreshToken", "", cookieOptions);
  res.cookie("issuer", "", cookieOptions);
};