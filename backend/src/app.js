import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import userRouter from "./routes/user.route.js";
import orderRouter from "./routes/order.route.js";
import interestedBuilderRouter from "./routes/interestedbuilder.route.js";
import builderRouter from "./routes/builder.route.js";
import session from "express-session";
import customerRouter from "./routes/customer.route.js";
const app=express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
// app.use(cookieParser());


app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// import requestRouter from "./routes/request.route.js"

app.use("/api/users",userRouter)
app.use("/api/orders",orderRouter)
app.use("/api/builder",interestedBuilderRouter);
app.use("/api/customer/details",customerRouter);
app.use("/api/builder/details",builderRouter);
// app.use("/api/requests",requestRouter)


export {app}