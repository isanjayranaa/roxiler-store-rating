import cloudinary from "../config/cloudinary.js";
import pool from "../config/db.js";
import { validateStore } from "../validations/store.validation.js";

export const addStore = async (req, res) => {
    let cloudinaryPublicId = null;

    try {
        const {
            name,
            email,
            address,
            ownerEmail
        } = req.body || {};

        // Validate store data
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

        // Check image uploaded by Multer
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Store image is required"
            });
        }

        const normalizedStoreEmail = email.trim().toLowerCase();
        const normalizedOwnerEmail = ownerEmail.trim().toLowerCase();

        // Check store owner
        const owner = await pool.query(
            `SELECT id, email
             FROM users
             WHERE email = $1
             AND role = 'STORE_OWNER'`,
            [normalizedOwnerEmail]
        );

        if (owner.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Store owner not found"
            });
        }

        const ownerId = owner.rows[0].id;

        // Check if this owner already has a store
        const existingOwnerStore = await pool.query(
            `SELECT id
             FROM stores
             WHERE owner_id = $1`,
            [ownerId]
        );

        if (existingOwnerStore.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "This store owner already has a store"
            });
        }

        // Check duplicate store email
        const existingStore = await pool.query(
            `SELECT id
             FROM stores
             WHERE email = $1`,
            [normalizedStoreEmail]
        );

        if (existingStore.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Store email already exists"
            });
        }

        // Upload image to Cloudinary
        const cloudinaryResponse = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "Roxiler/stores",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            return res.status(500).json({
                success: false,
                message:
                    cloudinaryResponse?.error?.message ||
                    "Image upload failed"
            });
        }

        const public_id = cloudinaryResponse.public_id;
        const url = cloudinaryResponse.secure_url;

        cloudinaryPublicId = public_id;

        const imageUrl = {
            url,
            public_id
        };

        // Create store
        const result = await pool.query(
            `INSERT INTO stores
            (
                name,
                email,
                owner_email,
                address,
                owner_id,
                image_url
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                id,
                name,
                email,
                owner_email,
                address,
                owner_id,
                image_url`,
            [
                name.trim(),
                normalizedStoreEmail,
                normalizedOwnerEmail,
                address.trim(),
                ownerId,
                JSON.stringify(imageUrl)
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Store created successfully",
            store: result.rows[0]
        });

    } catch (error) {

        // Delete Cloudinary image if database insertion fails
        if (cloudinaryPublicId) {
            await cloudinary.uploader
                .destroy(cloudinaryPublicId)
                .catch((deleteError) => {
                    console.log(
                        "Cloudinary cleanup failed:",
                        deleteError.message
                    );
                });
        }

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
                s.image_url,
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
                s.image_url,
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