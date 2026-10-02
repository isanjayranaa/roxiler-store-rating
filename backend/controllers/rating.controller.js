import pool from "../config/db.js";

export const submitRating = async (req, res) => {
    try {
        const { storeId, rating } = req.body || {};

        if (!storeId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Store ID and rating are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const store = await pool.query(
            "SELECT id FROM stores WHERE id = $1",
            [storeId]
        );

        if (store.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        const existingRating = await pool.query(
            `SELECT id
             FROM ratings
             WHERE user_id = $1 AND store_id = $2`,
            [req.user.id, storeId]
        );

        if (existingRating.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "You have already rated this store"
            });
        }

        const result = await pool.query(
            `INSERT INTO ratings
            (user_id, store_id, rating)
            VALUES ($1, $2, $3)
            RETURNING id, user_id, store_id, rating`,
            [req.user.id, storeId, rating]
        );

        return res.status(201).json({
            success: true,
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.error("Submit Rating Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateRating = async (req, res) => {
    try {
        const { storeId, rating } = req.body;

        if (!storeId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Store ID and rating are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const existingRating = await pool.query(
            `SELECT id
             FROM ratings
             WHERE user_id = $1 AND store_id = $2`,
            [req.user.id, storeId]
        );

        if (existingRating.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "You have not rated this store yet"
            });
        }

        const result = await pool.query(
            `UPDATE ratings
             SET rating = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $2 AND store_id = $3
             RETURNING id, user_id, store_id, rating`,
            [rating, req.user.id, storeId]
        );

        return res.status(200).json({
            success: true,
            message: "Rating updated successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.error("Update Rating Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};