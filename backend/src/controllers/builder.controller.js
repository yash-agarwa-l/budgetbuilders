import db from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

/** Fields safe to expose to customers browsing for a builder. */
const PUBLIC_ATTRIBUTES = [
  "id",
  "name",
  "address",
  "rating",
  "years_of_Experience",
  "type",
  "created_at",
];

export const createMyProfile = asyncHandler(async (req, res) => {
  const builder = await db.sequelize.transaction(async (transaction) => {
    const existing = await db.Builder.findOne({
      where: { user_id: req.user.id },
      transaction,
    });

    if (existing) {
      throw ApiError.conflict("A profile already exists for this account");
    }

    const created = await db.Builder.create(
      { ...req.body, user_id: req.user.id },
      { transaction },
    );

    await req.user.update({ is_details: true }, { transaction });

    return created;
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Profile created successfully", builder));
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const builder = await db.Builder.findOne({ where: { user_id: req.user.id } });

  if (!builder) {
    throw ApiError.notFound("No profile yet for this account");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile retrieved successfully", builder));
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const builder = await db.Builder.findOne({ where: { user_id: req.user.id } });

  if (!builder) {
    throw ApiError.notFound("No profile yet for this account");
  }

  // Rating is earned from completed work, never self-reported.
  const { rating, user_id, ...updatable } = req.body;
  void rating;
  void user_id;

  await builder.update(updatable);

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile updated successfully", builder));
});

/** The public directory a customer browses when choosing a builder. */
export const listBuilders = asyncHandler(async (req, res) => {
  const { page, limit, type } = req.validatedQuery;
  const offset = (page - 1) * limit;

  const { count, rows } = await db.Builder.findAndCountAll({
    where: type ? { type } : {},
    attributes: PUBLIC_ATTRIBUTES,
    limit,
    offset,
    order: [
      ["rating", "DESC"],
      ["years_of_Experience", "DESC"],
    ],
  });

  return res.status(200).json(
    new ApiResponse(200, "Builders retrieved successfully", {
      total: count,
      page,
      limit,
      builders: rows,
    }),
  );
});

export const getBuilderById = asyncHandler(async (req, res) => {
  const builder = await db.Builder.findByPk(req.params.id, {
    attributes: PUBLIC_ATTRIBUTES,
  });

  if (!builder) {
    throw ApiError.notFound("Builder not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Builder retrieved successfully", builder));
});
