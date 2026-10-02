import pool from "../config/db.js";

export const getOwnerDashboard = async (req, res) => {
    try {
        const storeResult = await pool.query(
            `SELECT id, name
             FROM stores
             WHERE owner_id = $1`,
            [req.user.id]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        const store = storeResult.rows[0];

        const ratingsResult = await pool.query(
            `SELECT
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,
                r.rating
             FROM ratings r
             JOIN users u
                ON r.user_id = u.id
             WHERE r.store_id = $1
             ORDER BY u.name ASC`,
            [store.id]
        );

        const averageResult = await pool.query(
            `SELECT
                COALESCE(ROUND(AVG(rating), 1), 0) AS average_rating
             FROM ratings
             WHERE store_id = $1`,
            [store.id]
        );

        return res.status(200).json({
            success: true,
            store: {
                id: store.id,
                name: store.name
            },
            averageRating: averageResult.rows[0].average_rating,
            ratings: ratingsResult.rows
        });

    } catch (error) {
        console.error("Owner Dashboard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};