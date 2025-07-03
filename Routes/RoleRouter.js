import express from 'express';
import { adminLogin, adminLogout } from '../Controller/RoleController.js'; 
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const roleRouter = express.Router();

roleRouter.post('/admin/login', adminLogin); 
roleRouter.post('/admin/logout', isAuthenticated, adminLogout); 

export default roleRouter;
