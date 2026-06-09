import bcrypt from "bcryptjs";

const generateOtp = () => {

  // Generate a 6-digit random number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

const hashOtp = async(otp) => {
  
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(otp, salt);

}


export { generateOtp, hashOtp };