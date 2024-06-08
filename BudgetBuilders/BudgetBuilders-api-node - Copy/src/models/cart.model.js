const mongoose=require("mongoose");

const cartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    cartItems:[{
        // type:mongoose.Schema.Types.ObjectId,
        // ref:"cartItems",
        // required:true
        cart:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"cart",
            required:true
        },
      
        price:{
            type:Number,
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
            default:1
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
        }
    }],
    totalPrice:{
        type:Number,
        required:true,
        default:0
    },
    totalItem:{
        type:Number,
        required:true,
        default:0
    },
    totalDiscountedPrice:{
        type:Number,
        required:true,
        default:0
    },
    discount:{
        type:Number,
        required:true,
        default:0
    }
});

const Cart=mongoose.model("cart",cartSchema);
module.exports=Cart;