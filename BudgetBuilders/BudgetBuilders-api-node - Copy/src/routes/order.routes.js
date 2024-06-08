const express=require("express")
const router=express.Router();

const orderController=require("../controller/order.controller")
const authenticate =require("../middleware/authenticate")


router.get("/",authenticate,orderController.createOrder);
router.put('/user',authenticate,orderController.OrderHistory);
router.put('/:id',authenticate,orderController.findOrderById);

module.exports=router;