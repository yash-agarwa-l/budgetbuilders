import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import db from '../models/index.js';


export const createBuilder = asyncHandler(async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { phone_no, name, address, gst_number, rating, years_of_Experience, type } = req.body;

        if (!phone_no || !name || !address || !gst_number || !type) {
            throw new ApiError(400, "phone_no, name, address, gst_number, and type are required");
        }

        const user_id = req.user.id;

        const user = await db.User.findByPk(user_id, { transaction });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        

        const builder = await db.Builder.create({
            user_id,
            phone_no,
            name,
            address,
            gst_number,
            rating: rating || 0.0,
            years_of_Experience: years_of_Experience || 0,
            type
        }, { transaction });

        user.is_details=true;
        await user.save({ transaction });

        await transaction.commit();

        return res.status(201).json(
            new ApiResponse(201, "Builder created successfully", builder)
        );

    } catch (error) {
        await transaction.rollback();

        if (error.name === 'SequelizeUniqueConstraintError') {
            const message = error.errors[0].path === 'phone_no' 
                ? "Phone number already exists" 
                : "GST number already exists";
            throw new ApiError(409, message);
        }

        const status = error.statusCode || 500;
        const message = error.message || "Failed to create builder";
        throw new ApiError(status, message);
    }
});



export const getBuilderById = asyncHandler(async (req, res) => {
    try {
        const id = req.user.id;

        const builder = await db.Builder.findByPk(id, {
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id', 'phone_no', 'created_at']
            }]
        });

        if (!builder) {
            throw new ApiError(404, "Builder not found");
        }

        return res.status(200).json(
            new ApiResponse(200, "Builder retrieved successfully", builder)
        );

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Failed to fetch builder";
        throw new ApiError(status, message);
    }
});

export const getAllBuilders = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: builders } = await db.Builder.findAndCountAll({
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id', 'phone_no', 'created_at']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json(
            new ApiResponse(200, "Builders retrieved successfully", {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                builders
            })
        );

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Failed to fetch builders";
        throw new ApiError(status, message);
    }
});


export const updateBuilder = asyncHandler(async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { phone_no, name, address, gst_number, rating, years_of_Experience, type } = req.body;

        const builder = await db.Builder.findByPk(id, { transaction });
        if (!builder) {
            throw new ApiError(404, "Builder not found");
        }

        // Update fields
        const updateData = {};
        if (phone_no) updateData.phone_no = phone_no;
        if (name) updateData.name = name;
        if (address) updateData.address = address;
        if (gst_number) updateData.gst_number = gst_number;
        if (rating) updateData.rating = rating;
        if (years_of_Experience) updateData.years_of_Experience = years_of_Experience;
        if (type) updateData.type = type;

        if (Object.keys(updateData).length === 0) {
            throw new ApiError(400, "At least one field to update is required");
        }

        await builder.update(updateData, { transaction });
        await transaction.commit();

        return res.status(200).json(
            new ApiResponse(200, "Builder updated successfully", builder)
        );

    } catch (error) {
        await transaction.rollback();

        if (error.name === 'SequelizeUniqueConstraintError') {
            const message = error.errors[0].path === 'phone_no' 
                ? "Phone number already exists" 
                : "GST number already exists";
            throw new ApiError(409, message);
        }

        const status = error.statusCode || 500;
        const message = error.message || "Failed to update builder";
        throw new ApiError(status, message);
    }
});



export const deleteBuilder = asyncHandler(async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;

        const builder = await db.Builder.findByPk(id, { transaction });
        if (!builder) {
            throw new ApiError(404, "Builder not found");
        }

        await builder.destroy({ transaction });
        await transaction.commit();

        return res.status(200).json(
            new ApiResponse(200, "Builder deleted successfully")
        );

    } catch (error) {
        await transaction.rollback();
        const status = error.statusCode || 500;
        const message = error.message || "Failed to delete builder";
        throw new ApiError(status, message);
    }
});

