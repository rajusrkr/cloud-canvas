import { Request } from "express";
import { db } from "../db";
import { User } from "../db/models/user.model";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
      const authToken = jwt.sign(
        { userId: dbUser._id },
        `${process.env.JWT_SECRET_SESSION}`
      );

      res.cookie("ccSession", { authToken })

      return res.status(200).json({ success: true, message: "Login success", username: dbUser.username })
    }

    return res
      .status(400)
      .json({ message: "Not able to verify your identity, CHECK PASSWORD" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went worng.." });
  }
};

export { signin }