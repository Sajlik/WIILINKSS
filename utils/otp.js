const otpModel = require('../models/otpSchema')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const createOTP = () => {
  const OTP = Math.floor(100000 + Math.random() * 900000);
  console.log("OTP is "+OTP)
  return OTP;
};

const hashOTP = async (otp) => {
    const otptohash = otp.toString()
  const hashedOTP = await bcrypt.hash(otptohash, saltRounds);
  console.log(hashedOTP)
  return hashedOTP;
};

const removeOTP = async(otpid)=>{
    try{
        await otpModel.findByIdAndDelete({_id:otpid})
    }
    catch(error)
    {
        console.log(error.message);
    }
}

const verifyOTP = async (otp, hashedOTP) => {
  const otpstatus = await bcrypt.compare(otp, hashedOTP);
  return otpstatus;
};

module.exports = { createOTP, hashOTP, verifyOTP,removeOTP };
