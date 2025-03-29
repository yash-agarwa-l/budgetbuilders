import db from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Creates the profile for the signed-in customer. The profile is keyed to the
 * session user, so a caller cannot create or claim somebody else's record.
 */
export const createMyProfile = asyncHandler(async (req, res) => {
  const customer = await db.sequelize.transaction(async (transaction) => {
    const existing = await db.Customer.findOne({
      where: { user_id: req.user.id },
      transaction,
    });

    if (existing) {
      throw ApiError.conflict("A profile already exists for this account");
    }

    const created = await db.Customer.create(
      { ...req.body, user_id: req.user.id },
      { transaction },
    );

    await req.user.update({ is_details: true }, { transaction });

    return created;
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Profile created successfully", customer));
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const customer = await db.Customer.findOne({
    where: { user_id: req.user.id },
  });

  if (!customer) {
    throw ApiError.notFound("No profile yet for this account");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile retrieved successfully", customer));
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const customer = await db.Customer.findOne({
    where: { user_id: req.user.id },
  });

  if (!customer) {
    throw ApiError.notFound("No profile yet for this account");
  }

  await customer.update(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile updated successfully", customer));
});

export const deleteMyProfile = asyncHandler(async (req, res) => {
  await db.sequelize.transaction(async (transaction) => {
    const customer = await db.Customer.findOne({
      where: { user_id: req.user.id },
      transaction,
    });

    if (!customer) {
      throw ApiError.notFound("No profile yet for this account");
    }

    await customer.destroy({ transaction });
    await req.user.update({ is_details: false }, { transaction });
  });

  return res.status(200).json(new ApiResponse(200, "Profile deleted"));
});
