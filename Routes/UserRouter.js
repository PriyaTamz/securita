import express from 'express';
import { getUserMfaQrCode, userLogin, verifyMfaToken} from '../Controller/UserController.js';

const userRouter = express.Router();

userRouter.get('/mfa-qrcode/:userId', getUserMfaQrCode);
userRouter.post('/user/login', userLogin); 
userRouter.post('/user/verify-mfa', verifyMfaToken);

export default userRouter;