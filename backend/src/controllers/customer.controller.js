import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import db from '../models/index.js';

export const createCustomer = asyncHandler(async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { phone_no, email, name, longitude, latitude, address } = req.body;

        // Validate required fields
        if (!phone_no || !email || !name) {
            throw new ApiError(400, "phone_no, email, and name are required");
        }

        if (!address) {
            throw new ApiError(400, "Address is required");
        }

        if (!longitude || !latitude) {
            throw new ApiError(400, "Longitude and latitude are required");
        }

        const user_id = req.user.id;

        // Find the user within the transaction
        const user = await db.User.findByPk(user_id, { transaction });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Create the customer within the transaction
        const customer = await db.Customer.create({
            user_id,
            phone_no,
            name,
            email,
            longitude,
            latitude,
            address
        }, { transaction });

        // Update user.is_details within the transaction
        user.is_details = true;
        await user.save({ transaction });

        // Commit the transaction
        await transaction.commit();

        // Return success response
        return res.status(201).json(
            new ApiResponse(201, "Customer created successfully", customer)
        );

    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();

        // Handle unique constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            const message = error.errors[0].path === 'phone_no'
                ? "Phone number already exists"
                : "Email already exists";
            throw new ApiError(409, message);
        }

        // Handle other errors
        const status = error.statusCode || 500;
        const message = error.message || "Failed to create customer";
        throw new ApiError(status, message);
    }
});

export const getCustomers = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: customers } = await db.Customer.findAndCountAll({
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id', 'created_at']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json(
            new ApiResponse(200, "Customers retrieved successfully", {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                customers
            })
        );

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Failed to fetch customers";
        throw new ApiError(status, message);
    }
});

export const getCustomerById = asyncHandler(async (req, res) => {
    try {
        // const { id } = req.params;
        const id= req.user.id;
        console.log(id);
        const customer = await db.Customer.findOne({
            where: { user_id: id },
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id', 'created_at']
            }]
        });

        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }

        return res.status(200).json(
            new ApiResponse(200, "Customer retrieved successfully", customer)
        );

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Failed to fetch customer";
        throw new ApiError(status, message);
    }
});

export const updateCustomer = asyncHandler(async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { phone_no, email, longitude, latitude, address } = req.body;

        const customer = await db.Customer.findByPk(id, { transaction });
        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }

        const updateData = {};
        if (phone_no) updateData.phone_no = phone_no;
        if (email) updateData.email = email;
        if (longitude) updateData.longitude = longitude;
        if (latitude) updateData.latitude = latitude;
        if (address) updateData.address = address;

        if (Object.keys(updateData).length === 0) {
            throw new ApiError(400, "At least one field to update is required");
        }

        await customer.update(updateData, { transaction });
        await transaction.commit();

        return res.status(200).json(
            new ApiResponse(200, "Customer updated successfully", customer)
        );

    } catch (error) {
        await transaction.rollback();
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            const message = error.errors[0].path === 'phone_no' 
                ? "Phone number already exists" 
                : "Email already exists";
            throw new ApiError(409, message);
        }

        const status = error.statusCode || 500;
        const message = error.message || "Failed to update customer";
        throw new ApiError(status, message);
    }
});

// Delete customer (soft delete)
export const deleteCustomer = asyncHandler(async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;

        const customer = await db.Customer.findByPk(id, { transaction });
        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }

        await customer.destroy({ transaction });
        await transaction.commit();

        return res.status(200).json(
            new ApiResponse(200, "Customer deleted successfully")
        );

    } catch (error) {
        await transaction.rollback();
        const status = error.statusCode || 500;
        const message = error.message || "Failed to delete customer";
        throw new ApiError(status, message);
    }
});