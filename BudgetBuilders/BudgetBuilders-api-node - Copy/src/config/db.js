const mongoose = require("mongoose")

const mongodbUrl="mongodb+srv://kritikag456:56Y20ra6WamBvYgi@cluster0.frs5tnc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDb=()=>{
    return mongoose.connect(mongodbUrl);
}

module.exports={connectDb}