import express from "express";
import {
  sendOtp,
  verifyOtpAndLogin,
  refreshAccessToken,
  logout,
  logoutAll,
  me,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  otpRequestLimiter,
  otpVerifyLimiter,
} from "../middlewares/rateLimit.middleware.js";
import {
  requestOtpSchema,
  verifyOtpSchema,
  refreshSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post(
  "/otp/request",
  otpRequestLimiter,
  validate({ body: requestOtpSchema }),
  sendOtp,
);

router.post(
  "/otp/verify",
  otpVerifyLimiter,
  validate({ body: verifyOtpSchema }),
  verifyOtpAndLogin,
);

router.post("/refresh", validate({ body: refreshSchema }), refreshAccessToken);
router.post("/logout", logout);
router.post("/logout-all", verifyJWT, logoutAll);
router.get("/me", verifyJWT, me);

export default router;
