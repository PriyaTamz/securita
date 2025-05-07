import express from 'express';
import { createAdmin, createUser, getAllUsers, getUserById, updateUser, deleteUser, activateUser, enableMfaForUser, createOrganization, getAllOrganization, getOrganizationById } from '../Controller/UserManagementController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorizeRole.js';

const userManagementRouter = express.Router();

userManagementRouter.post('/create/organization', authenticate, authorizeRole('superadmin', 'admin'), createOrganization);
userManagementRouter.get('/organization', authenticate, authorizeRole('superadmin', 'admin'), getAllOrganization);
userManagementRouter.get('/get/organization/:id', authenticate, authorizeRole('superadmin', 'admin'), getOrganizationById);

userManagementRouter.post('/create/admin', authenticate, authorizeRole('superadmin'), createAdmin);

userManagementRouter.post('/create', authenticate, authorizeRole('superadmin', 'admin'), createUser);
userManagementRouter.get('/get', authenticate, authorizeRole('superadmin', 'admin'), getAllUsers);
userManagementRouter.get('/getbyId/:id', authenticate, authorizeRole('superadmin', 'admin'), getUserById);
userManagementRouter.put('/update/:id', authenticate, authorizeRole('superadmin', 'admin'), updateUser);
userManagementRouter.delete('/delete/:id', authenticate, authorizeRole('superadmin', 'admin'), deleteUser);

userManagementRouter.patch('/activate/:id', authenticate, authorizeRole('superadmin', 'admin'), activateUser);

userManagementRouter.get('/generate-mfa/:id', authenticate, authorizeRole('superadmin', 'admin'), enableMfaForUser);

export default userManagementRouter;
