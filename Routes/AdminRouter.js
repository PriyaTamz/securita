import express from 'express';
import { adminLogin, createGroup, getAllGroup } from '../Controller/AdminController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorizeRole.js';

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.post('/create/group', authenticate, authorizeRole('superadmin', 'admin'), createGroup);
adminRouter.get('/group', authenticate, authorizeRole('superadmin', 'admin'), getAllGroup);

export default adminRouter;
