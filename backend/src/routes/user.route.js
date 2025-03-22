
import express from "express";
import {sendOtp,verifyOtp,refreshAccessToken } from "../controllers/auth.controller.js";

const userRouter = express.Router();
userRouter.post("/send-otp", sendOtp);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/refresh", refreshAccessToken);
export default userRouter;