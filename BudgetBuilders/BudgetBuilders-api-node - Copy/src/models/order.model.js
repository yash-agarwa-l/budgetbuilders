const mongoose=require("mongoose");
const {Schema} = mongoose;

const orderSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"cart"
    },
    orderItems:[{
        // type:mongoose.Schema.Types.ObjectId,
        // ref:"orderItems",
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
    }],
    orderDate:{
        type:Date,
        required:true,
        default:Date.now()
    },
    deliveryDate:{
        type:Date,
    },
    shippingAddress:{
        // type:mongoose.Schema.Types.ObjectId,
        // ref:"addresses"
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        streetAddress:{
            type:String,
            requiredd:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        zipCode:{
            type:Number,
            required:true
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users"
        },
        mobile:{
            type:String,
            required:true
        }
    },
    paymentDetails:{

        paymentMethod:{
            type:String,
        },
        transactionId:{
            type:String,
        },
        paymentId:{
            type:String,
        },
        paymentStatus:{
            type:String,
            default:"PENDING"
        }
    },
    totalDiscountedPrice:{
        type:Number,
        required:true
        
    },
    orderStatus:{
        type:String,
        required:true,
        default:"PENDING"
    },
    totalPrice:{
        type:Number,
        required:true
    },
    totalItem:{
        type:Number,
        required:true
    },
});

const Order=mongoose.model("order",orderSchema);
module.exports=Order;