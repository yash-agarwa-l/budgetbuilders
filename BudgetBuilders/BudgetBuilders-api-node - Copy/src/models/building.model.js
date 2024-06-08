const mongoose=require("mongoose");

const buildingSchema=new mongoose.Schema({
    typeOfBuilding:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    floors:{
        type:String,
        required:true
    },
    rooms:{
        type:String,
        required:true
    },
    offeringPrice:{
        type:String,
        required:true
    }
})

const Building=mongoose.model("building",buildingSchema);
module.exports=Building;