import sequelize from "./db/db.js";
import dotenv from 'dotenv';
import { app } from "./app.js";
import db from "./models/index.js";

dotenv.config({
})

sequelize.sync()
.then(()=>{
    console.log("Connected to Database")
    app.listen(process.env.PORT || 3000,()=>{
        console.log("server running !!!",process.env.PORT )
    })
})
.catch((err)=>{
    console.log("connection failed", err)
});