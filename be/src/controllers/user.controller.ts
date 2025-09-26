import { Request } from "express";
import { db } from "../db";
import { User } from "../db/models/user.model";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { OTP } from "../db/models/otp.model";
import { sendVerificationMail } from "../lib/sendVerificationMail";
import { Session } from "../db/models/session.model";

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

      const createOtp = await OTP.create({
        otp: hashedOtp,
        otpFor: dbUser.id,
        expiry: Date.now() + addFiveMin,
        isExpired: false,
        isUsed: false,
      })

      // verify cookie
      const otpVerifyToken = jwt.sign({ userId: dbUser._id, user: dbUser.username, otpId: createOtp._id }, `${process.env.JWT_SECRET_SESSION}`)

      res.cookie("otpVerifyToken", otpVerifyToken, {
        maxAge: 1 * 60 * 1000,
        secure: true,
        sameSite: "strict"
      })
      return res.status(200).json({ success: true, message: "Signin otp generated successfully" })
    }

    return res
      .status(400)
      .json({ message: "No account found with this email id" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went worng.." });
  }
};

// OTP verify
const otpVerify = async (req: Request, res: any) => {
  const data = req.body;
  // @ts-ignore
  const userId = req.userId
  //@ts-ignore
  const otpId = req.otpId;
  //@ts-ignore
  const user = req.user;

  try {
    // Delete prev used and expired otps
    await OTP.deleteMany({ isUsed: true })
    await OTP.deleteMany({ isExpired: true })

    /**
     * Steps to verify otp
     * 
     * first get the otp by otp id.
     * then check if its expired or if its already used
     * then verify the otp if its correct
     * if correct return the auth token
     */

    const findOtp = await OTP.findOne({ otpFor: userId, _id: otpId })

    if (!findOtp) {
      return res.status(401).json({ success: false, message: "Invalid or wrong otp." })
    }


    if (findOtp.isUsed) {
      return res.status(401).json({ success: false, message: "This otp is alreday been used" })
    }

    if (findOtp.isExpired) {
      return res.status(401).json({ success: false, message: "The otp has expired" })
    }

    const currentTime = Date.now()

    if (currentTime > findOtp.expiry) {
      await OTP.findByIdAndDelete(otpId);
      return res.status(401).json({ success: false, message: "This is a expired otp" })
    }


    // Verify
    const dbOtp = findOtp.otp;
    const verify = bcrypt.compareSync(data.otp, dbOtp);

    if (!verify) {
      return res.status(401).json({ success: false, message: "Wrong otp" })
    }

    await OTP.findByIdAndUpdate(otpId, { isUsed: true })

    // Create session
    const session = await Session.create({
      state: "active"
    })


    const authToken = jwt.sign({ user: findOtp.otpFor, sessionId: session._id }, `${process.env.JWT_SECRET_SESSION}`)

    res.cookie("ccSession", authToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "strict"
    })

    return res.status(200).json({ success: true, message: "Otp verification success", user })

  } catch (error) {
    console.log("Error");
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

// handle user session, delete session
const handleSession = async (req: Request, res: any) => {
  // Get the session id
  // @ts-ignore
  const sessionId = req.sessionId

  try {
    const deleteSession = await Session.findByIdAndDelete(sessionId);

    if (deleteSession) {
      res.clearCookie("ccSession", {
        domain: "localhost",
        path: "/"
      })
      return res.status(200).json({success: true, message: "Session deleted"})
    } else {
      return res.status(500).json({success: false, message: "Unable to delete session, try again"})
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({success: false, message: "Internal server error"})
  }
}

export { signin, otpVerify, handleSession }