import express from 'express';
import { createAdmin, removeAdmin, createUser, getAllUsers, getUserById, updateUser, deleteUser, activateUser, enableMfaForUser, createOrganization, getAllOrganization, getOrganizationById } from '../Controller/UserManagementController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorizeRole.js';

const userManagementRouter = express.Router();

userManagementRouter.post('/create/organization', isAuthenticated, authorizeRoles(['superadmin']), createOrganization);
userManagementRouter.get('/organization', isAuthenticated, authorizeRoles(['superadmin']), getAllOrganization);
userManagementRouter.get('/get/organization/:id', isAuthenticated, authorizeRoles(['superadmin']), getOrganizationById);

userManagementRouter.post('/create/admin', isAuthenticated, authorizeRoles('superadmin'), createAdmin);
userManagementRouter.post('/remove/admin', isAuthenticated, authorizeRoles('superadmin'), removeAdmin);

userManagementRouter.post('/create', isAuthenticated, authorizeRoles(['superadmin', 'admin']), createUser);
userManagementRouter.get('/get', isAuthenticated, authorizeRoles(['superadmin', 'admin']), getAllUsers);
userManagementRouter.get('/getbyId/:id', isAuthenticated, authorizeRoles(['superadmin', 'admin']), getUserById);
userManagementRouter.put('/update/:id', isAuthenticated, authorizeRoles(['superadmin', 'admin']), updateUser);
userManagementRouter.delete('/delete/:id', isAuthenticated, authorizeRoles(['superadmin', 'admin']), deleteUser);

userManagementRouter.patch('/activate/:id', isAuthenticated, authorizeRoles(['superadmin', 'admin']), activateUser);

userManagementRouter.get('/generate-mfa/:id', isAuthenticated, authorizeRoles(['superadmin', 'admin']), enableMfaForUser);

export default userManagementRouter;
