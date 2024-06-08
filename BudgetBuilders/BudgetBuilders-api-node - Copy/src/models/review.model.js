const mongoose = require('mongoose');
const {Schema} = mongoose;

const reviewSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        require:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products",
        require:true
    },
    review:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

const Review=mongoose.model("reviews",reviewSchema);
module.exports=Review;