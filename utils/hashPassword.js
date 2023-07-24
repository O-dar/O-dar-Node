import bcrypt from "bcrypt";

// 비밀번호 해시화(암호화)
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(5); // 랜덤한 솔트 값 생성
  const hashedPassword = await bcrypt.hash(password, salt); // 비밀번호 해시화
  return hashedPassword;
};

export default hashPassword;