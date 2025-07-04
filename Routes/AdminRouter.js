import express from 'express';
import { adminLogin } from '../Controller/AdminController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorizeRole.js';

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);

export default adminRouter;
