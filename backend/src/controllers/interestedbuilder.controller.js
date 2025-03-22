import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import db from '../models/index.js';
import { where } from 'sequelize';

export const createInterestedBuilder = asyncHandler(async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { order_id, builder_id, bid_amount, bid_status } = req.body;

        //builder_id from middleware
        if (!order_id || !bid_amount) {
            throw new ApiError(400, "order_id and bid_amount are required");
        }

        const order = await db.Order.findByPk(order_id, { transaction });
        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        const builder = await db.Builder.findByPk(builder_id, { transaction });
        if (!builder) {
            throw new ApiError(404, "Builder not found");
        }

        const interest = await db.InterestedBuilder.create({
            order_id,
            builder_id,
            bid_amount,
            bid_status: bid_status || 'pending'
        }, { transaction });

        await transaction.commit();

        return res.status(201).json(
            new ApiResponse(201, "Builder interest recorded successfully", interest)
        );

    } catch (error) {
        await transaction.rollback();
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new ApiError(409, "This builder has already shown interest in this order");
        }

        const status = error.statusCode || 500;
        const message = error.message || "Failed to record builder interest";
        throw new ApiError(status, message);
    }
});


export const getInterestsByOrderId = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        const order = await db.Order.findByPk(orderId);
        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        const { count, rows: interests } = await db.InterestedBuilder.findAndCountAll({
            where: { order_id: orderId },
            include: [
                {
                    model: db.Builder,
                    as: 'builder',
                    attributes: ['id', 'name']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json(
            new ApiResponse(200, "Interests retrieved successfully", {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                interests
            })
        );

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Failed to fetch interests";
        throw new ApiError(status, message);
    }
});

export const getInterestsByBuilderId = asyncHandler(async (req, res) => {
    try {
        const builderId = 1;
        const { page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        const builder = await db.Builder.findByPk(builderId);
        if (!builder) {
            throw new ApiError(404, "Builder not found");
        }

        const { count, rows: interests } = await db.InterestedBuilder.findAndCountAll({
            where: { builder_id: builderId },
            include: [
                {
                    model: db.Order,
                    as: 'order',
                    attributes: ['id', 'total_offered_price', 'order_status']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json(
            new ApiResponse(200, "Interests retrieved successfully", {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                interests
            })
        );

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Failed to fetch interests";
        throw new ApiError(status, message);
    }
});

export const getPendinginterestsByBuilderId = asyncHandler(async (req, res) => {
    try {
        const user_id = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;


        const builder = await db.Builder.findOne({ 
            where: { user_id } 
        });

        if (!builder) {
            throw new ApiError(404, "Builder not found");
        }

        const { count, rows: interests } = await db.InterestedBuilder.findAndCountAll({
            where: { 
                builder_id: builder.id, 
                bid_status: 'pending'   
            },
            include: [
                {
                    model: db.Order,
                    as: 'order',
                    attributes: ['id', 'total_offered_price', 'order_status']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json(
            new ApiResponse(200, "Interests retrieved successfully", {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                interests
            })
        );

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Failed to fetch interests";
        throw new ApiError(status, message);
    }
});


export const getOngoinginterestsByBuilderId = asyncHandler(async (req, res) => {
    try {
        const user_id = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;


        const builder = await db.Builder.findOne({ 
            where: { user_id } 
        });

        if (!builder) {
            throw new ApiError(404, "Builder not found");
        }

        const { count, rows: interests } = await db.InterestedBuilder.findAndCountAll({
            where: { 
                builder_id: builder.id, 
                bid_status: 'ongoing'   
            },
            include: [
                {
                    model: db.Order,
                    as: 'order',
                    attributes: ['id', 'total_offered_price', 'order_status']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json(
            new ApiResponse(200, "Interests retrieved successfully", {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                interests
            })
        );

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Failed to fetch interests";
        throw new ApiError(status, message);
    }
});

export const getinterestsByBuilderId = asyncHandler(async (req, res) => {
    try {
        const user_id = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;


        const builder = await db.Builder.findOne({ 
            where: { user_id } 
        });

        if (!builder) {
            throw new ApiError(404, "Builder not found");
        }

        const { count, rows: interests } = await db.InterestedBuilder.findAndCountAll({
            where: { 
                builder_id: builder.id, 
                bid_status: 'pending'   
            },
            include: [
                {
                    model: db.Order,
                    as: 'order',
                    attributes: ['id', 'total_offered_price', 'order_status']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json(
            new ApiResponse(200, "Interests retrieved successfully", {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                interests
            })
        );

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Failed to fetch interests";
        throw new ApiError(status, message);
    }
});


export const updateInterest = asyncHandler(async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { bid_amount, bid_status } = req.body;

        if (!bid_amount && !bid_status) {
            throw new ApiError(400, "At least one field (bid_amount or bid_status) is required");
        }

        const interest = await db.InterestedBuilder.findByPk(id, { transaction });
        if (!interest) {
            throw new ApiError(404, "Interest record not found");
        }

        if (bid_status && !['pending', 'accepted', 'rejected'].includes(bid_status)) {
            throw new ApiError(400, "Invalid bid_status value");
        }

        if (bid_amount !== undefined && bid_amount < 0) {
            throw new ApiError(400, "Bid amount cannot be negative");
        }

        const updateData = {};
        if (bid_amount !== undefined) updateData.bid_amount = bid_amount;
        if (bid_status) updateData.bid_status = bid_status;

        await interest.update(updateData, { transaction });
        await transaction.commit();

        return res.status(200).json(
            new ApiResponse(200, "Interest updated successfully", interest)
        );

    } catch (error) {
        await transaction.rollback();
        const status = error.statusCode || 500;
        const message = error.message || "Failed to update interest";
        throw new ApiError(status, message);
    }
});


export const deleteInterest = asyncHandler(async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;

        const interest = await db.InterestedBuilder.findByPk(id, { transaction });
        if (!interest) {
            throw new ApiError(404, "Interest record not found");
        }

        await interest.destroy({ transaction });
        await transaction.commit();

        return res.status(200).json(
            new ApiResponse(200, "Interest deleted successfully")
        );

    } catch (error) {
        await transaction.rollback();
        const status = error.statusCode || 500;
        const message = error.message || "Failed to delete interest";
        throw new ApiError(status, message);
    }
});