import express from "express";
import {
  placeBid,
  getBidsForOrder,
  getMyBids,
  acceptBid,
  withdrawBid,
} from "../controllers/bid.controller.js";
import {
  verifyJWT,
  requireBuilder,
  requireCustomer,
  attachBuilderProfile,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  placeBidSchema,
  idParamSchema,
  orderIdParamSchema,
  bidListQuerySchema,
} from "../validators/bid.validator.js";

const router = express.Router();

router.use(verifyJWT);

// Builder-side: place, review and withdraw own bids.
router.post(
  "/",
  requireBuilder,
  attachBuilderProfile,
  validate({ body: placeBidSchema }),
  placeBid,
);

router.get(
  "/mine",
  requireBuilder,
  attachBuilderProfile,
  validate({ query: bidListQuerySchema }),
  getMyBids,
);

router.delete(
  "/:id",
  requireBuilder,
  attachBuilderProfile,
  validate({ params: idParamSchema }),
  withdrawBid,
);

// Customer-side: see bids on an owned order and award the job.
router.get(
  "/order/:orderId",
  requireCustomer,
  validate({ params: orderIdParamSchema, query: bidListQuerySchema }),
  getBidsForOrder,
);

router.post(
  "/:id/accept",
  requireCustomer,
  validate({ params: idParamSchema }),
  acceptBid,
);

export default router;
