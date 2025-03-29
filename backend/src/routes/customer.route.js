import express from "express";
import {
  createMyProfile,
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
} from "../controllers/customer.controller.js";
import { verifyJWT, requireCustomer } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../validators/profile.validator.js";

const router = express.Router();

router.use(verifyJWT, requireCustomer);

router
  .route("/me")
  .post(validate({ body: createCustomerSchema }), createMyProfile)
  .get(getMyProfile)
  .patch(validate({ body: updateCustomerSchema }), updateMyProfile)
  .delete(deleteMyProfile);

export default router;
