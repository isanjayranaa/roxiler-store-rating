import pool from "../config/db.js";
import { validateStore } from "../validations/store.validation.js";

export const addStore = async (req, res) => {
    try {
        const { name, email, address, ownerEmail } = req.body || {};

        const error = validateStore({
            name,
            email,
            address,
            ownerEmail
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        const owner = await pool.query(
            `SELECT id
             FROM users
             WHERE email = $1 AND role = 'STORE_OWNER'`,
            [ownerEmail.trim().toLowerCase()]
        );

        if (owner.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Store owner not found"
            });
        }

        const ownerId = owner.rows[0].id;

        const result = await pool.query(
            `INSERT INTO stores
            (name, email, address, owner_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, address, owner_id`,
            [
                name.trim(),
                email.trim().toLowerCase(),
                address.trim(),
                ownerId
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Store created successfully",
            store: result.rows[0]
        });

    } catch (error) {
        console.error("Add Store Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getStores = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            sortBy = "name",
            order = "asc"
        } = req.query;

        const allowedSortFields = {
            name: "s.name",
            email: "s.email",
            address: "s.address",
            rating: "rating"
        };

        const sortField = allowedSortFields[sortBy] || "s.name";
        const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

        let query = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(AVG(r.rating), 0) AS rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
        `;

        const conditions = [];
        const values = [];

        if (name) {
            values.push(`%${name}%`);
            conditions.push(`s.name ILIKE $${values.length}`);
        }

        if (email) {
            values.push(`%${email}%`);
            conditions.push(`s.email ILIKE $${values.length}`);
        }

        if (address) {
            values.push(`%${address}%`);
            conditions.push(`s.address ILIKE $${values.length}`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(" AND ")}`;
        }

        query += `
            GROUP BY s.id
            ORDER BY ${sortField} ${sortOrder}
        `;

        const result = await pool.query(query, values);

        return res.status(200).json({
            success: true,
            stores: result.rows
        });

    } catch (error) {
        console.error("Get Stores Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//store for normal users
export const getUserStores = async (req, res) => {
    try {
        const { name, address } = req.query;

        let query = `
            SELECT
                s.id,
                s.name,
                s.address,
                COALESCE(ROUND(AVG(r.rating), 1), 0) AS overall_rating,
                COALESCE(
                    MAX(CASE
                        WHEN r.user_id = $1 THEN r.rating
                    END),
                    0
                ) AS user_rating
            FROM stores s
            LEFT JOIN ratings r
                ON s.id = r.store_id
        `;

        const values = [req.user.id];
        const conditions = [];

        if (name) {
            values.push(`%${name}%`);
            conditions.push(`s.name ILIKE $${values.length}`);
        }

        if (address) {
            values.push(`%${address}%`);
            conditions.push(`s.address ILIKE $${values.length}`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(" AND ")}`;
        }

        query += `
            GROUP BY s.id
            ORDER BY s.name ASC
        `;

        const result = await pool.query(query, values);

        return res.status(200).json({
            success: true,
            stores: result.rows
        });

    } catch (error) {
        console.error("Get User Stores Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};