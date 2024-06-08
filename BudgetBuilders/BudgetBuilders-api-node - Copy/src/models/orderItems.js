// to be deleted

const mongoose = require('mongoose');
const {Schema} = mongoose;

const orderSchema=new Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products",
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true
    },
    size:{
        type:String,
        required:true,
    },
    discountedPrice:{
        type:Number,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    deliveryDate:{
        type:Date
    }
});

const OrderItem=mongoose.model("orderItems",orderItemSchema);
module.exports=OrderItem;