import express from 'express';
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import {protectRoute,adminRoute} from "../middlewares/authMiddleware.js"
const router = express.Router();



// Get all users
router.get('/',protectRoute,adminRoute, getAllUsers);

// Update user role
router.put('/:userId/role',protectRoute,adminRoute, updateUserRole);

// Delete user
router.delete('/:userId',protectRoute,adminRoute, deleteUser);

export default router; 