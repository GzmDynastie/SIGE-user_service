import express from 'express';
import UserController from '../controller/user.controller.js';
import { authenticateToken } from '../auth/middleware.auth.js';

const router = express.Router();

router.post("/", authenticateToken, UserController.createUser);
router.get("/",authenticateToken, UserController.getAllUsers);
router.get("/:id", authenticateToken, UserController.getUserById);
router.put("/:id", authenticateToken, UserController.updateUser);
router.delete("/:id", authenticateToken, UserController.deleteUser);

export default router;
