import express from "express";
import { createBuilder, getBuilderById, getAllBuilders, updateBuilder, deleteBuilder } from "../controllers/builder.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const builderRouter = express.Router();

builderRouter.use(verifyJWT); 
builderRouter
    .post("/", createBuilder)
    .get("/mydetails", getBuilderById)
    .get("/", getAllBuilders)
    .put("/:id", updateBuilder)
    .delete("/:id", deleteBuilder);

export default builderRouter;