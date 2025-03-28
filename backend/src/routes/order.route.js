import express from "express";
import {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderById,
  getMyOrders,
  getOpenOrders,
} from "../controllers/order.controller.js";
import {
  verifyJWT,
  requireCustomer,
  requireBuilder,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createOrderSchema,
  updateOrderSchema,
  idParamSchema,
  listQuerySchema,
} from "../validators/order.validator.js";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .post(requireCustomer, validate({ body: createOrderSchema }), createOrder)
  .get(requireCustomer, validate({ query: listQuerySchema }), getMyOrders);

// The marketplace feed of work available to bid on.
router.get(
  "/open",
  requireBuilder,
  validate({ query: listQuerySchema }),
  getOpenOrders,
);

router
  .route("/:id")
  .get(validate({ params: idParamSchema }), getOrderById)
  .patch(
    requireCustomer,
    validate({ params: idParamSchema, body: updateOrderSchema }),
    updateOrder,
  )
  .delete(requireCustomer, validate({ params: idParamSchema }), deleteOrder);

export default router;
