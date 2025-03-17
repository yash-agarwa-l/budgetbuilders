import pool from "./db/db.js";
import dotenv from 'dotenv';
import { app } from "./app.js";

dotenv.config({
})

pool.connect()
.then(()=>{
    // console.log("Connected to Database")
    app.listen(process.env.PORT || 8000,()=>{
        console.log("server running !!!",process.env.PORT )
    })
})
.catch((err)=>{
    console.log("connection failed", err)
})