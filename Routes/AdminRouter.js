import express from 'express';
import { adminLogin, createGroup, getAllGroup } from '../Controller/AdminController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorizeRole.js';

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.post('/create/group', isAuthenticated, authorizeRoles('admin'), createGroup);
adminRouter.get('/group', isAuthenticated, authorizeRoles('admin'), getAllGroup);

export default adminRouter;
