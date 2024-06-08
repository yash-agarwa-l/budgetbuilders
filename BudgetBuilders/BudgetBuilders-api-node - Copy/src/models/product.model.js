const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema=new Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categories"
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true
    },
    sizes:[{
        name:{ type:String},
        quantity:{type:Number}
    }],
    discountedPrice:{
        type:Number,
    },
    discountedPercent:{
        type:Number,
    },
    imageUrl:{
        type:string
    },
   ratings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ratings",
    }],
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"reviews",
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    numRating:{
        type:Number,
        default:0
    }
});

const Product=mongoose.model("products",productSchema);
module.exports=Product;