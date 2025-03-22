
import express from "express";
import { createOrder,getAllOrders,getOrderById,getOrdersByUserId,updateOrder,deleteOrder } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.use(verifyJWT);
orderRouter
.post("/createOrder", createOrder)
.delete("/deleteOrder/:id", deleteOrder)
.put("/updateOrder/:id", updateOrder)
.get("/getOrderById", getOrderById)
.get("/cart", getOrdersByUserId)
.get("/getAllOrders", getAllOrders)
;
export default orderRouter;