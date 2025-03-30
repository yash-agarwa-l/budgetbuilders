import db from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Places or revises this builder's bid on an order. The builder is taken from
 * the authenticated session, never from the request body, so a builder cannot
 * bid in somebody else's name.
 */
export const placeBid = asyncHandler(async (req, res) => {
  const { order_id, bid_amount } = req.body;
  const builderId = req.builder.id;

  const { bid, created } = await db.sequelize.transaction(
    async (transaction) => {
      const order = await db.Order.findByPk(order_id, { transaction });

      if (!order) {
        throw ApiError.notFound("Order not found");
      }

      if (order.order_status !== "pending") {
        throw ApiError.conflict("This order is no longer accepting bids");
      }

      const existing = await db.InterestedBuilder.findOne({
        where: { order_id, builder_id: builderId },
        transaction,
      });

      if (existing) {
        if (existing.bid_status !== "pending") {
          throw ApiError.conflict("This bid has already been decided");
        }
        await existing.update({ bid_amount }, { transaction });
        return { bid: existing, created: false };
      }

      const placed = await db.InterestedBuilder.create(
        { order_id, builder_id: builderId, bid_amount, bid_status: "pending" },
        { transaction },
      );
      return { bid: placed, created: true };
    },
  );

  return res
    .status(created ? 201 : 200)
    .json(
      new ApiResponse(
        created ? 201 : 200,
        created ? "Bid placed successfully" : "Bid updated successfully",
        bid,
      ),
    );
});

/** The bids on one of the caller's own orders. */
export const getBidsForOrder = asyncHandler(async (req, res) => {
  const { page, limit } = req.validatedQuery;
  const offset = (page - 1) * limit;

  const order = await db.Order.findOne({
    where: { id: req.params.orderId, user_id: req.user.id },
  });

  if (!order) {
    throw ApiError.notFound("Order not found");
  }

  const { count, rows } = await db.InterestedBuilder.findAndCountAll({
    where: { order_id: order.id },
    include: [
      {
        model: db.Builder,
        as: "builder",
        attributes: ["id", "name", "rating", "years_of_experience", "type"],
      },
    ],
    limit,
    offset,
    order: [["bid_amount", "ASC"]],
    distinct: true,
  });

  return res.status(200).json(
    new ApiResponse(200, "Bids retrieved successfully", {
      total: count,
      page,
      limit,
      bids: rows,
    }),
  );
});

/** The caller's own bids, optionally filtered by status. */
export const getMyBids = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.validatedQuery;
  const offset = (page - 1) * limit;

  const { count, rows } = await db.InterestedBuilder.findAndCountAll({
    where: {
      builder_id: req.builder.id,
      ...(status ? { bid_status: status } : {}),
    },
    include: [
      {
        model: db.Order,
        as: "order",
        attributes: ["id", "total_offered_price", "order_status", "created_at"],
      },
    ],
    limit,
    offset,
    order: [["created_at", "DESC"]],
    distinct: true,
  });

  return res.status(200).json(
    new ApiResponse(200, "Bids retrieved successfully", {
      total: count,
      page,
      limit,
      bids: rows,
    }),
  );
});

/**
 * Awards the job. Accepting one bid closes the order at that price and
 * rejects every competing bid, all in one transaction so the order can never
 * end up accepted with two winning bids.
 */
export const acceptBid = asyncHandler(async (req, res) => {
  const result = await db.sequelize.transaction(async (transaction) => {
    const bid = await db.InterestedBuilder.findByPk(req.params.id, {
      transaction,
    });

    if (!bid) {
      throw ApiError.notFound("Bid not found");
    }

    const order = await db.Order.findOne({
      where: { id: bid.order_id, user_id: req.user.id },
      transaction,
    });

    if (!order) {
      throw ApiError.notFound("Bid not found");
    }

    if (order.order_status !== "pending") {
      throw ApiError.conflict("This order has already been awarded");
    }

    await bid.update({ bid_status: "accepted" }, { transaction });

    await db.InterestedBuilder.update(
      { bid_status: "rejected" },
      {
        where: { order_id: order.id, bid_status: "pending" },
        transaction,
      },
    );

    await order.update(
      { order_status: "accepted", closed_price: bid.bid_amount },
      { transaction },
    );

    return { order, bid };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Bid accepted successfully", result));
});

/** Withdraws a pending bid the caller placed. */
export const withdrawBid = asyncHandler(async (req, res) => {
  const bid = await db.InterestedBuilder.findOne({
    where: { id: req.params.id, builder_id: req.builder.id },
  });

  if (!bid) {
    throw ApiError.notFound("Bid not found");
  }

  if (bid.bid_status !== "pending") {
    throw ApiError.conflict("Only a pending bid can be withdrawn");
  }

  await bid.destroy();

  return res.status(200).json(new ApiResponse(200, "Bid withdrawn"));
});
