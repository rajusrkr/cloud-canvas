import { Request } from "express";
import { db } from "../db";
import { User } from "../db/models/user.model";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { OTP } from "../db/models/otp.model";
import { sendVerificationMail } from "../utils/sendVerificationMail";

//signin
const signin = async (req: Request, res: any) => {
  const { data } = req.body;

  try {
    await db();
    const dbUser = await User.findOne({ email: data.email });


    if (dbUser) {
      //compare password
      const dbUserPassword = dbUser.password;
      const compare = await bcrypt.compare(data.password, dbUserPassword);

      if (!compare) {
        return res.status(401).json({ success: false, message: "Wrong credentials" })
      }

      // Genejrate otp func
      function generateOtp() {
        const randomString = "ABCDEFGHIJKLMNPQRST123456789"
        let otp = "";

        for (let i = 0; i < 6; i++) {
          const index = Math.floor(Math.random() * randomString.length);
          console.log(index);

          otp += randomString[index]
        }
        return otp;
      }
      // Hold otp
      const otp = generateOtp()
      // send the mail using nodemailer
      sendVerificationMail({ email: data.email, otp: otp })
      // Hash otp
      const hashedOtp = bcrypt.hashSync(otp, 10);
      const addFiveMin = 5 * 60 * 1000;

      await OTP.create({
        otp: hashedOtp,
        otpFor: dbUser.id,
        expiry: Date.now() + addFiveMin,
        isExpired: false,
        isUsed: false,
      })

      // verify cookie
      const otpVerifyToken = jwt.sign({ userId: dbUser._id }, `${process.env.JWT_SECRET_SESSION}`)

      res.cookie("otpVerifyToken", otpVerifyToken)
      return res.status(200).json({ success: true, message: "Signin otp generated successfully" })
    }

    return res
      .status(400)
      .json({ message: "Not able to verify your identity" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went worng.." });
  }
};
// verify user session
const verify = async (req: Request, res: any) => {
  const data = req.body;
  const userName = data.userName

  // @ts-ignore
  const userId = req.userId

  try {
    const findUser = await User.findOne({ _id: userId, username: userName })

    if (findUser === null) {
      return res.status(401).json({ message: "Authentication failed", success: false })
    } else {
      return res.status(200).json({ message: "Verified", success: true })
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Internal server error", success: false })
  }
}
// OTP verify
const otpVerify = async (req: Request, res: any) => {
  const data = req.body;
  // @ts-ignore
  const userId = req.userId
console.log(userId);

  try { 
    // Delete prev used and expired otps
    await OTP.deleteMany({isUsed: true})
    await OTP.deleteMany({isExpired: true})

    /**
     * Steps to verify otp
     * 
     * first get the otp by otp id.
     * then check if its expired or if its already used
     * then verify the otp if its correct
     * if correct return the auth token
     */

    const findOtp = await OTP.findById(data.otpId)

    console.log(findOtp);

  } catch (error) {

  }
}

export { signin, verify }