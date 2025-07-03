import express from 'express';
import { userLogin, getMfaQrCode, verifyMfaToken, userLogout } from '../Controller/UserController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/user/login', userLogin); 
userRouter.get('/mfa-qrcode/:userId', getMfaQrCode);
userRouter.post('/verify-mfa/:userId', verifyMfaToken);

userRouter.post('/user/logout', isAuthenticated, userLogout);

export default userRouter;