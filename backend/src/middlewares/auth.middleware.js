import db from "../models/index.js";
import jwt from "jsonwebtoken";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";


const verifyJWT=asyncHandler(async(req,_,next)=>{

    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"unauthorized request")
        }
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_SECRET)
        
        const user=await db.User.findByPk(decodedToken?.id)
        // const user=await db.User.findByPk(1);
        // .select("-googleId -refreshToken")
        if(!user){
            throw new ApiError(401,"invalid token")
        }
        req.user=user
        next()
    } catch (error) {
        throw new ApiError(401,error?.message ||"Invalid token")
        
    }


})

export {verifyJWT}