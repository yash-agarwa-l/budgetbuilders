import axios from "axios";
import dotenv from "dotenv";

import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const sendOtp = async (req, res) => {
  const { phoneNo } = req.body;
  
  if (!phoneNo) {
    return res.status(400).json({ error: "Phone number required" });
  }

  try {
    const response = await axios.post(
      'https://api.otpless.com/auth/otp/send',
      {
        phoneNumber: phoneNo,
        channel: "SMS", 
        otpLength: 6,
        expiry: 90,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'clientId': process.env.OTPLESS_CLIENT_ID,
          'clientSecret': process.env.OTPLESS_CLIENT_SECRET,
        },
      }
    );

    await cache.set(phoneNo, response.data.orderId, 'EX', 90);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};


export const verifyOtp = asyncHandler(async (req, res) => {
  const { phoneNo, otp } = req.body;

  if (!phoneNo || !otp) {
      throw new ApiError(400, "Phone number and OTP are required");
  }

  if (otpStorage[phoneNo] && otpStorage[phoneNo] == otp) {
      delete otpStorage[phoneNo]; 
      return res.status(200).json(new ApiResponse(200, "OTP verified successfully"));
  } else {
      throw new ApiError(401, "Invalid OTP");
  }
});
