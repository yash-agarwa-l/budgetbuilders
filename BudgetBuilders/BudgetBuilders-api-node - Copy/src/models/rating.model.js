const mongoose = require('mongoose');
const {Schema} = mongoose;

const ratingSchema=new Schema({
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
    rating:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

const Rating=mongoose.model("ratings",ratingsSchema);
module.exports=Rating;