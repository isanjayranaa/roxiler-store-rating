import express from "express";
import { addUser, getDashboard, getStoreOwners, getUserDetails, getUsers } from "../controllers/admin.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getStores } from "../controllers/store.controller.js";

const router = express.Router();

router.get(
    "/dashboard",
    isAuthenticated,
    authorizeRoles("ADMIN"),
    getDashboard
);

router.post(
    "/create-users",
    isAuthenticated,
    authorizeRoles("ADMIN"),
    addUser
);

router.get(
    "/users",
    isAuthenticated,
    authorizeRoles("ADMIN"),
    getUsers
);

router.get(
    "/store-owners",
    isAuthenticated,
    authorizeRoles("ADMIN"),
    getStoreOwners
);

router.get(
    "/stores",
    isAuthenticated,
    authorizeRoles("ADMIN"),
    getStores
);

router.get(
    "/users/:id",
    isAuthenticated,
    authorizeRoles("ADMIN"),
    getUserDetails
);

export default router;