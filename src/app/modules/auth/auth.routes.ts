import express from "express";
import { authController } from "./auth.controller";

const router = express.Router();

router.post("/login", authController.loginUser);
router.get("/token", authController.getToken);

export const authRouter = router;
