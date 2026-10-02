import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.roxiler_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Token does not match"
            });
        }

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token does not match or has expired"
        });
    }
};