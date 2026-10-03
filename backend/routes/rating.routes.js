import express from "express";

import {
    getMyRatings,
    submitRating,
    updateRating
} from "../controllers/rating.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    isAuthenticated,
    authorizeRoles("USER"),
    submitRating
);

router.put(
    "/update",
    isAuthenticated,
    authorizeRoles("USER"),
    updateRating
);

router.get(
    "/my-ratings",
    isAuthenticated,
    authorizeRoles("USER"),
    getMyRatings
);

export default router;