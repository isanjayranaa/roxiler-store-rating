import express from "express";
import { changePassword, getMe, login, logout, register } from "../controllers/auth.controller.js";
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
router.get(
    "/me",
    isAuthenticated,
    getMe
);

export default router;