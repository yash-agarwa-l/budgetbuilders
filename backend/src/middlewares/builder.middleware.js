import db from "../models/index.js";
import jwt from "jsonwebtoken";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";


const isBuilder=asyncHandler(async(req,_,next)=>{

    try {
        
        const userid= req.user.id
        const user=await db.User.findByPk(userid)
        if(!user){
            throw new ApiError(401,"unauthorized request")
        }
        if(user.role!=="builder"){
            throw new ApiError(401,"You are not a builder")
        }
        next()
    } catch (error) {
        throw new ApiError(401,error?.message ||"Invalid token")
        
    }
})

export {isBuilder}