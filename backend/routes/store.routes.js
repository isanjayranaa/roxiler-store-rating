import express from "express";
import { addStore, getStores, getUserStores } from "../controllers/store.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

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
    upload.single("storeImage"),
    addStore
);


export default router;