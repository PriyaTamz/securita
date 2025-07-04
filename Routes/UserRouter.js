import express from 'express';
import { userLogin, getMfaQrCode, verifyMfaToken, getUserGroups, getUserGroupById, userLogout } from '../Controller/UserController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/user/login', userLogin); 
userRouter.get('/mfa-qrcode/:userId', getMfaQrCode);
userRouter.post('/verify-mfa/:userId', verifyMfaToken);

userRouter.get('/groups', isAuthenticated, authorizeRoles('user'), getUserGroups)
userRouter.get('/groups/:groupId', isAuthenticated, authorizeRoles('user'), getUserGroupById)

userRouter.post('/user/logout', isAuthenticated, userLogout);

export default userRouter;