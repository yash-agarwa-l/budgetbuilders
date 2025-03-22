import db from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

const createOrder = asyncHandler(async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { total_offered_price, subOrders } = req.body;
        const user_id = req.user.id; 

        if (!total_offered_price || !subOrders?.length) {
            throw new ApiResponse(400, "Total price and suborders required");
        }

        const user = await db.User.findByPk(user_id, { transaction });
        if (!user) throw new ApiResponse(404, "User not found");

        for (const sub of subOrders) {
            if (!sub.type || !sub.details) {
                throw new ApiResponse(400, "Missing type/details in suborder");
            }
            if (!['house', 'stairs', 'room', 'ceiling', 'other'].includes(sub.type)) {
                throw new ApiResponse(400, `Invalid type: ${sub.type}`);
            }
        }

        const order = await db.Order.create({
            total_offered_price,
            user_id: user.id,
            order_status: 'pending'
        }, { transaction });

        const subOrderData = subOrders.map(sub => ({
            ...sub,
            order_id: order.id
        }));

        await db.SubOrder.bulkCreate(subOrderData, { 
            transaction,
            validate: true 
        });

        await transaction.commit();

        return res.status(201).json(
            new ApiResponse(201, "Order created successfully", {
                order,
                subOrders: subOrderData
            })
        );

    } catch (error) {
        await transaction.rollback();
        const message = error.errors?.[0]?.message || error.message;
        const status = error.status || 500;
        throw new ApiError(status, message);
    }
});

const updateOrder = asyncHandler(async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { total_offered_price, order_status } = req.body;

        const order = await db.Order.findByPk(id, { transaction });
        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        if (total_offered_price !== undefined) {
            order.total_offered_price = total_offered_price;
        }

        if (order_status && !['pending', 'accepted', 'completed', 'cancelled'].includes(order_status)) {
            throw new ApiError(400, "Invalid order status");
        }

        if (order_status) {
            order.order_status = order_status;
        }

        await order.save({ transaction });
        await transaction.commit();

        return res.status(200).json(
            new ApiResponse(200, "Order updated successfully", order)
        );

    } catch (error) {
        await transaction.rollback();
        const status = error.status || 500;
        const message = error.message || "Failed to update order";
        throw new ApiError(status, message);
    }
});


const deleteOrder = asyncHandler(async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        
        const order = await db.Order.findByPk(id, { transaction });
        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        await order.destroy({ transaction });
        await transaction.commit();

        return res.status(200).json(
            new ApiResponse(200, "Order deleted successfully")
        );

    } catch (error) {
        await transaction.rollback();
        const status = error.status || 500;
        const message = error.message || "Failed to delete order";
        throw new ApiError(status, message);
    }
});

const getOrderById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await db.Order.findByPk(id, {
            include: [{
                model: db.SubOrder,
                as: 'subOrders'
            }]
        });

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        return res.status(200).json(
            new ApiResponse(200, "Order retrieved successfully", order)
        );

    } catch (error) {
        const status = error.status || 500;
        const message = error.message || "Failed to fetch order";
        throw new ApiError(status, message);
    }
});

// const getOrdersByUserId = asyncHandler(async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { page = 1, limit = 10 } = req.query;

//         const offset = (page - 1) * limit;

//         const { count, rows: orders } = await db.Order.findAndCountAll({
//             where: { user_id: userId },
//             include: [{
//                 model: db.SubOrder,
//                 as: 'subOrders'
//             }],
//             limit: parseInt(limit),
//             offset: parseInt(offset),
//             order: [['created_at', 'DESC']]
//         });

//         return res.status(200).json(
//             new ApiResponse(200, "Orders retrieved successfully", {
//                 total: count,
//                 page: parseInt(page),
//                 limit: parseInt(limit),
//                 orders
//             })
//         );

//     } catch (error) {
//         const status = error.status || 500;
//         const message = error.message || "Failed to fetch orders";
//         throw new ApiError(status, message);
//     }
// });

const getOrdersByUserId = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;

        const offset = (page - 1) * limit;

        // Define the where clause
        const whereClause = { user_id: userId };
        if (status) {
            whereClause.order_status = status; // Add status filter if provided
        }

        const { count, rows: orders } = await db.Order.findAndCountAll({
            where: whereClause, // Apply user_id and optional status filter
            include: [{
                model: db.SubOrder,
                as: 'subOrders'
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json(
            new ApiResponse(200, "Orders retrieved successfully", {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                orders
            })
        );

    } catch (error) {
        const status = error.status || 500;
        const message = error.message || "Failed to fetch orders";
        throw new ApiError(status, message);
    }
});


const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (status) whereClause.order_status = status;

        const { count, rows: orders } = await db.Order.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: db.SubOrder,
                    as: 'subOrders'
                },
                // {
                //     model: db.User,
                //     as: 'user', // Ensure this matches the alias in the association
                //     attributes: ['id', 'name']
                // }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json(
            new ApiResponse(200, "Orders retrieved successfully", {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                orders
            })
        );

    } catch (error) {
        const status = error.status || 500;
        const message = error.message || "Failed to fetch orders";
        throw new ApiError(status, message);
    }
});
export { 
    createOrder, 
    updateOrder, 
    deleteOrder, 
    getOrderById, 
    getOrdersByUserId, 
    getAllOrders 
};