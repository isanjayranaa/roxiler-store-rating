import pool from "../config/db.js";
import { validateUser } from "../validations/user.validation.js";
import bcrypt from "bcrypt";

export const getDashboard = async (req, res) => {
    try {
        const users = await pool.query(
            "SELECT COUNT(*) FROM users"
        );

        const stores = await pool.query(
            "SELECT COUNT(*) FROM stores"
        );

        const ratings = await pool.query(
            "SELECT COUNT(*) FROM ratings"
        );

        return res.status(200).json({
            success: true,
            totalUsers: Number(users.rows[0].count),
            totalStores: Number(stores.rows[0].count),
            totalRatings: Number(ratings.rows[0].count)
        });

    } catch (error) {
        console.error("Dashboard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//admin can create user 

export const addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body || {};

        const error = validateUser({
            name,
            email,
            password,
            address,
            role
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users
            (name, email, password, address, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, address, role`,
            [
                name.trim(),
                normalizedEmail,
                hashedPassword,
                address.trim(),
                role
            ]
        );

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Add User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//get users
export const getUsers = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            role,
            sortBy = "name",
            order = "asc"
        } = req.query;

        const allowedSortFields = {
            name: "u.name",
            email: "u.email",
            address: "u.address",
            role: "u.role",
            rating: "rating"
        };

        const sortField = allowedSortFields[sortBy] || "u.name";

        const sortOrder =
            order.toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        let query = `
            SELECT
                u.id,
                u.name,
                u.email,
                u.address,
                u.role,

                CASE
                    WHEN u.role = 'STORE_OWNER'
                    THEN COALESCE(AVG(r.rating), 0)
                    ELSE 0
                END AS rating

            FROM users u

            LEFT JOIN stores s
                ON s.owner_id = u.id

            LEFT JOIN ratings r
                ON r.store_id = s.id
        `;

        const conditions = [];
        const values = [];

        if (name) {
            values.push(`%${name}%`);

            conditions.push(
                `u.name ILIKE $${values.length}`
            );
        }

        if (email) {
            values.push(`%${email}%`);

            conditions.push(
                `u.email ILIKE $${values.length}`
            );
        }

        if (address) {
            values.push(`%${address}%`);

            conditions.push(
                `u.address ILIKE $${values.length}`
            );
        }

        if (role) {
            values.push(role);

            conditions.push(
                `u.role = $${values.length}`
            );
        }

        if (conditions.length > 0) {
            query += `
                WHERE ${conditions.join(" AND ")}
            `;
        }

        query += `
            GROUP BY
                u.id,
                u.name,
                u.email,
                u.address,
                u.role

            ORDER BY ${sortField} ${sortOrder}
        `;

        const result = await pool.query(query, values);

        return res.status(200).json({
            success: true,
            users: result.rows
        });

    } catch (error) {
        console.error("Get Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//get stores owner 
export const getStoreOwners = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email
             FROM users
             WHERE role = 'STORE_OWNER'
             ORDER BY name ASC`
        );

        return res.status(200).json({
            success: true,
            storeOwners: result.rows
        });

    } catch (error) {
        console.error("Get Store Owners Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//user details
export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                u.id,
                u.name,
                u.email,
                u.address,
                u.role,
                COALESCE(AVG(r.rating), 0) AS rating
             FROM users u
             LEFT JOIN stores s ON s.owner_id = u.id
             LEFT JOIN ratings r ON r.store_id = s.id
             WHERE u.id = $1
             GROUP BY u.id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Get User Details Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};