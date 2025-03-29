import express from "express";
import {
  createMyProfile,
  getMyProfile,
  updateMyProfile,
  listBuilders,
  getBuilderById,
} from "../controllers/builder.controller.js";
import { verifyJWT, requireBuilder } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createBuilderSchema,
  updateBuilderSchema,
  builderListQuerySchema,
  idParamSchema,
} from "../validators/profile.validator.js";

const router = express.Router();

router.use(verifyJWT);

// Own profile. Declared before /:id so "me" is never read as an id.
router
  .route("/me")
  .post(requireBuilder, validate({ body: createBuilderSchema }), createMyProfile)
  .get(requireBuilder, getMyProfile)
  .patch(
    requireBuilder,
    validate({ body: updateBuilderSchema }),
    updateMyProfile,
  );

// Public directory, readable by any signed-in user.
router.get("/", validate({ query: builderListQuerySchema }), listBuilders);
router.get("/:id", validate({ params: idParamSchema }), getBuilderById);

export default router;
