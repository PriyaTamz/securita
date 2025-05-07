import express from 'express';
import { userLogin, verifyMfaToken} from '../Controller/UserController.js';

const userRouter = express.Router();

userRouter.post('/user/login', userLogin); 
userRouter.post('/user/verify-mfa', verifyMfaToken);

export default userRouter;