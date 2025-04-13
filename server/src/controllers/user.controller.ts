import { Request } from "express";
import { db } from "../db";
import { User } from "../db/models/user.model";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//signup
const signup = async (req: Request, res: any) => {
    const { data } = req.body;
  
    try {
      await db();
      const dbUser = await User.findOne({ email: data.email });
  
      if (dbUser) {
        return res
          .status(400)
          .json({ message: "User already exists with the provided email" });
      }
  
      const hashedPassword = bcrypt.hashSync(data.password, 10);
      const user = await User.create({
        username: data.email,
        email: data.email,
        password: hashedPassword,
      });
  
      if (!user) {
        return res.status(400).json({ message: "Unable to register you." });
      }
  
      return res.status(200).json({ success: true, message: "Account created" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong..." });
    }
  };
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
  
        if (compare) {
          const jwt_token = jwt.sign(
            { userId: dbUser._id },
            `${process.env.JWT_SECRET_SESSION}`
          );
  
          return res.status(200).json({success: true, message: "Lohin success", username: dbUser.username, token: jwt_token})
        }
      }
  
      return res
        .status(400)
        .json({ message: "Not able to verify your identity, CHECK PASSWORD" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went worng.." });
    }
  };

  export {signin, signup}