import express from "express";
import { changePassword, login, logout, register } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout", logout);
router.put(
    "/change-password",
    isAuthenticated,
    changePassword
);

export default router;