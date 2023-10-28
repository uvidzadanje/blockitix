import express from "express";
import { AuthController } from "../controllers/auth.controller";

const authController = new AuthController();
const router = express.Router();

router.post("/register", authController.register);
router.get("/:id", authController.getAuthInfo);

export default router;