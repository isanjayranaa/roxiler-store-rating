import express from "express";

import { getOwnerDashboard } from "../controllers/storeOwner.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
    "/dashboard",
    isAuthenticated,
    authorizeRoles("STORE_OWNER"),
    getOwnerDashboard
);

export default router;