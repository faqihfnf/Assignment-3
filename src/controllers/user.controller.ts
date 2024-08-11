import type { Request, Response } from "express";
import { User } from "../models/user.schema";
import bcrypt from "bcrypt";
import jwt, { verify } from "jsonwebtoken";
import { Auth } from "../models/auth.schema";
import dotenv from "dotenv";

dotenv.config();

const UserController = {
  handleRegister: async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 13);
    const newUser = {
      name,
      email,
      password: hashedPassword,
    };
    const createUser = new User(newUser);
    const data = await createUser.save();
    return res.status(201).json({ message: "Register Success", data });
  },

  handleLogin: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || password.length < 8) {
      return res.status(403).json({ message: "Email minimal 8 caracters" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPassMatch = await bcrypt.compare(password, user.password as string);
    if (!isPassMatch) {
      return res.status(403).json({ message: "Password not match" });
    }
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: "7d",
    });

    const newRefreshToken = new Auth({
      userId: user.id,
      refreshToken,
    });
    await newRefreshToken.save();
    return res.cookie("accessToken", accessToken, { httpOnly: true }).cookie("refreshtoken", refreshToken, { httpOnly: true }).status(200).json({ message: "Login Success" });
  },

  handleLogout: async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    await Auth.findOneAndDelete({ refreshToken });
    return res.clearCookie("accessToken").clearCookie("refreshToken").json({ message: "Logout Success" });
  },
  handleResource: async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = req.cookies;

    //* Cek apakah ada access token
    if (accessToken) {
      try {
        jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string);
        console.log("Access Token Valid");
        return res.json({ data: "Ini datanya..." });
      } catch (error) {
        //* kalau tidak valid  maka generate ulang
        if (!refreshToken) {
          console.log("Refresh Token Invalid");
          return res.status(401).json({ message: "Please Re-Login" });
        }

        try {
          //* check jika refresh token valid
          console.log("Verifikasi Refresh Token");
          jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
          //* jika valid, cek apakah ada di database
          console.log("Cek refresh token ke database");
          const activeRefreshToken = await Auth.findOne({ refreshToken });

          if (!activeRefreshToken) {
            console.log("Refresh Token tidak ada di database");
            return res.status(401).json({ message: "Please Re-Login" });
          }
          const payload = jwt.decode(refreshToken) as { id: string; name: string; email: string };

          console.log("Buat access token baru");
          const newAccesToken = jwt.sign({ id: payload?.id, name: payload.name, email: payload.email }, process.env.JWT_ACCESS_SECRET as string, {
            expiresIn: 300,
          });

          return res.cookie("accessToken", newAccesToken, { httpOnly: true }).json({ data: "access token" });
        } catch (error) {
          return res.status(401).json({ message: "Please Re-Login" });
        }
      }
    }
  },
};

export default UserController;
