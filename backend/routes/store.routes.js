import express from "express";
import { addStore, getStores, getUserStores } from "../controllers/store.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();


router.get(
    "/",
    isAuthenticated,
    authorizeRoles("ADMIN"),
    getStores
);

router.get(
    "/user",
    isAuthenticated,
    authorizeRoles("USER"),
    getUserStores
);

router.post(
    "/create-store",
    isAuthenticated,
    authorizeRoles("ADMIN"),
    addStore
);


export default router;