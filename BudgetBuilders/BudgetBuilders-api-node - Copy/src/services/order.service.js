const cartService=require("../services/cart.services")
const Order=require("../models/order.model")


async function createOrder(user,shippAddress){
    let address;

    if(shippAddress._id){
        let existAddress=await address.findById(address._id);
        address=existAddress;
    }
    else{
        adddress=new address(shippAddress);
        address.user=user;
        await address.save();

        user.addresses.push(address);
        await user.save();
    }
    const cart=await cartService.findUserCart(user._id);
    const orderItems=[];

    for(const item of cart.cartItems){
        const orderItem= new orderItems({
            price:item.price,
            product:item.product,
            quantity:item.size,
            iserId:item.userId,
            discountedPrice:item.discountedPrice
        })
        const createdOrderItem=awaitorderItem.save();
        orderItems.push(createdOrderItem)
    }
    const createdOrder=new orderItems({
        user,
        orderItems,
        totalPrice:cart.totalPrice,
        totalDiscountedPrice:cart.totalDiscountedPrice,
        discount:cart.discount,
        totalItem:cart.totalItem,
        shippAdress:address
    })
    const savedOrder=await createOrder.save();
    return savedOrder;
}

async function confirmedOrder(orderId){
    const order=await findOrderById(orderId);

    order.orderStatus ="CONFIRMED";
    order.paymentDetails.status="COMPLETE";

    return await order.save();
}

async function placedOrder(orderId){
    const order=await findOrderById(orderId);

    order.orderStatus ="PLACED";
    order.paymentDetails.status="COMPLETE";

    return await order.save();
}

async function shipOrder(orderId){
    const order=await findOrderById(orderId);

    order.orderStatus ="SHIPPED";
    order.paymentDetails.status="COMPLETE";

    return await order.save();
}

async function deliverOrder(orderId){
    const order=await findOrderById(orderId);

    order.orderStatus ="DELIVERED";
    order.paymentDetails.status="COMPLETE";

    return await order.save();
}

async function cancelledOrder(orderId){
    const order=await findOrderById(orderId);

    order.orderStatus ="CANCELLED";
    order.paymentDetails.status="COMPLETE";

    return await order.save();
}

async function findOrderById(orderId){
    const order=await Order.findById(orderId).populate("user")
    .populate("shippingAddress")
    .populate({path:"orderItems",populate:{path:"product"}})


    return order
}

async function userOrderHistory(userId){
    try {
        const orders=await Order.find({user:userId,orderStatus:"PLACED"})
        .populate({path:"orderItems",populate:{path:"product"}}).lean()
        return orders;
    } catch (error) {
        throw new Error(error.message)
    }
}

async function getAllOrders(){
    return await Order.find()
    .populate({path:"orderItems",populate:{path:"product"}}).lean()
}

async function deleteOrder(orderId){
    const order=await findOrderById(orderId);
    await Order.findByIdAndDelete(order._id);
}

module.exports={
    createOrder,
    placedOrder,
    confirmedOrder,
    shipOrder,
    deleteOrder,
    deliverOrder,
    cancelledOrder,
    findOrderById,
    getAllOrders,
    userOrderHistory
}
