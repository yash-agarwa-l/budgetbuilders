import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import db from "../models/index.js";
import jwt from "jsonwebtoken";

const options={
    httpOnly:true,
    secure:true
}

const getAccessAndRefreshToken = async (userId) => {
    try {
        const user = await db.User.findByPk(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
            throw new ApiError(500, "JWT secrets not found in environment variables");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error in getAccessAndRefreshToken:", error);
        throw new ApiError(500, "Error generating tokens");
    }
};

const sendOtp = asyncHandler(async (req, res) => {
    const {phoneNo}= req.body;
    if(!phoneNo){
        throw new ApiError(400,"Phone number is required")
    }

    try{
        // const otp = await db.Otp.generateOtp(phoneNo);
        return new ApiResponse(200,"OTP sent successfully",{})
    }catch(error){
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong");
    }
})




const verifyOtp = asyncHandler(async (req, res) => {
    const { phoneNo, otp,type } = req.body;

    if (!phoneNo || !otp) {
        throw new ApiError(400, "Phone number and OTP are required");
    }

    try {
        const dummyOtp = "123456"; 
        if (otp !== dummyOtp) {
            throw new ApiError(401, "Invalid OTP");
        }

        let user = await db.User.findOne({
            where: { phone_no: phoneNo }
        });



        

        if (!user) {
            user = await db.User.create({
                phone_no: phoneNo,
                type: type, 
                refreshToken: null,
                is_details:false
            });
        }


        const { accessToken, refreshToken } = await getAccessAndRefreshToken(user.id);

        await user.update({ refreshToken });

        const loggedInUser = {
            id: user.id,
            phone_no: user.phone_no,
            type: user.type,
            created_at: user.created_at,
            updated_at: user.updated_at,
            is_details:user.is_details
        };

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        res.setHeader("Access-Token", accessToken);
        res.setHeader("Refresh-Token", refreshToken);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, "OTP verified successfully", {
                accessToken,
                refreshToken,
                user: loggedInUser
            }));

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong");
    }
});

const logoutUser=asyncHandler(async (req,res)=> {
    await User.findByIdAndUpdate(
        req.user._id,

        {

            $unset:{
            refreshToken:1
            }
        },
        {
            new:true
        }
   )

   res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,"user looged out",{}))

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies?.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }
   try {
     const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_SECRET)
 
     const user=await User.findById(decodedToken?._id)
     if (!user) {
         throw new ApiError(401, "Invalid refresh token")
     }
 
     if(incomingRefreshToken!==user?.refreshToken){
         throw new ApiError(401,"token expired or used")
     }
 
     const {accessToken,newRefreshToken}=getAccessAndRefreshToken(user?._id)
 
     return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(
         new ApiResponse(
             200,"Access token refreshed",{accessToken, refreshToken: newRefreshToken}
         )
     )
   } catch (error) {

    throw new ApiError(401, error?.message || "Invalid refresh token") 
   }
})

export {
    // registerUser,
    sendOtp,
    verifyOtp,
    logoutUser,
    refreshAccessToken
}