import express from 'express';
import { adminLogin } from '../Controller/RoleController.js'; 

const roleRouter = express.Router();

roleRouter.post('/admin/login', adminLogin); 

export default roleRouter;
