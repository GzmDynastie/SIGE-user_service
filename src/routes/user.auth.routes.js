import express from 'express';
import AuthController from '../controller/auth.controller.js';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);

export default router;