import db from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const ORDER_INCLUDES = [{ model: db.SubOrder, as: "subOrders" }];

/**
 * Loads an order the caller is allowed to act on. Ownership is checked in the
 * query itself, so one customer can never read or modify another's order by
 * guessing an id.
 */
async function findOwnedOrder(orderId, userId, transaction) {
  const order = await db.Order.findOne({
    where: { id: orderId, user_id: userId },
    transaction,
  });

  if (!order) {
    // Deliberately a 404 rather than a 403: revealing that the id exists but
    // belongs to somebody else is itself a leak.
    throw ApiError.notFound("Order not found");
  }

  return order;
}

export const createOrder = asyncHandler(async (req, res) => {
  const { total_offered_price, subOrders } = req.body;

  const order = await db.sequelize.transaction(async (transaction) => {
    const created = await db.Order.create(
      {
        total_offered_price,
        user_id: req.user.id,
        order_status: "pending",
      },
      { transaction },
    );

    await db.SubOrder.bulkCreate(
      subOrders.map((sub) => ({ ...sub, order_id: created.id })),
      { transaction, validate: true },
    );

    return db.Order.findByPk(created.id, {
      include: ORDER_INCLUDES,
      transaction,
    });
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Order created successfully", order));
});

export const updateOrder = asyncHandler(async (req, res) => {
  const { total_offered_price, order_status } = req.body;

  const order = await db.sequelize.transaction(async (transaction) => {
    const found = await findOwnedOrder(req.params.id, req.user.id, transaction);

    // Once builders have committed to a price the customer cannot silently
    // move it; the order has to be cancelled and raised again.
    if (total_offered_price !== undefined && found.order_status !== "pending") {
      throw ApiError.conflict(
        "The offered price can only be changed while the order is pending",
      );
    }

    await found.update(
      {
        ...(total_offered_price !== undefined ? { total_offered_price } : {}),
        ...(order_status ? { order_status } : {}),
      },
      { transaction },
    );

    return found;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Order updated successfully", order));
});

export const deleteOrder = asyncHandler(async (req, res) => {
  await db.sequelize.transaction(async (transaction) => {
    const order = await findOwnedOrder(req.params.id, req.user.id, transaction);

    if (order.order_status === "accepted") {
      throw ApiError.conflict(
        "An accepted order cannot be deleted; cancel it instead",
      );
    }

    await order.destroy({ transaction });
  });

  return res.status(200).json(new ApiResponse(200, "Order deleted successfully"));
});

/** A customer reads their own order; a builder may read any open order to bid. */
export const getOrderById = asyncHandler(async (req, res) => {
  const where = { id: req.params.id };

  if (req.user.role === "customer") {
    where.user_id = req.user.id;
  }

  const order = await db.Order.findOne({ where, include: ORDER_INCLUDES });

  if (!order) {
    throw ApiError.notFound("Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Order retrieved successfully", order));
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.validatedQuery;
  const offset = (page - 1) * limit;

  const { count, rows } = await db.Order.findAndCountAll({
    where: {
      user_id: req.user.id,
      ...(status ? { order_status: status } : {}),
    },
    include: ORDER_INCLUDES,
    limit,
    offset,
    order: [["created_at", "DESC"]],
    distinct: true,
  });

  return res.status(200).json(
    new ApiResponse(200, "Orders retrieved successfully", {
      total: count,
      page,
      limit,
      orders: rows,
    }),
  );
});

/**
 * The open marketplace a builder browses. Only pending orders are listed, so
 * work already awarded stops drawing bids.
 */
export const getOpenOrders = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.validatedQuery;
  const offset = (page - 1) * limit;

  const { count, rows } = await db.Order.findAndCountAll({
    where: { order_status: status ?? "pending" },
    include: ORDER_INCLUDES,
    limit,
    offset,
    order: [["created_at", "DESC"]],
    distinct: true,
  });

  return res.status(200).json(
    new ApiResponse(200, "Orders retrieved successfully", {
      total: count,
      page,
      limit,
      orders: rows,
    }),
  );
});
