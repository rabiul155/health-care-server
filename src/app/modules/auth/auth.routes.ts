import express from "express";
import { authController } from "./auth.controller";
import { Authenticate } from "../../middleware/auth";

const router = express.Router();

router.post("/login", authController.loginUser);

router.post("/change-password", Authenticate, authController.changePassword);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

router.get("/token", authController.getToken);

export const authRouter = router;
