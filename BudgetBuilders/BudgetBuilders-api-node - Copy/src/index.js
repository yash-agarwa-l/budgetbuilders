const express =  require("express")
const cors=require("cors")
const app=express()

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    return res.status(200).send({message :"welcome",status:true})
})

const authRouters=require("./routes/auth.router.js")
app.use("/auth",authRouters);

const userRouters=require("./routes/user.router.js")
app.use("/api/users",userRouters);

const cartRouter=require("./routes/carts.routes.js");
app.use("/api/cart",cartRouter)

const orderRouter=require("./routes/order.routes.js");
app.use("/api/reviews",orderRouter)

const adminOrderRouter=require("./routes/adminOrder.routes.js")
app.use("/api/reviews",adminOrderRouter);

module.exports=app;