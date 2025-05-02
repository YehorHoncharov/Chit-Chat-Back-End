import express from 'express';
import userController from './userController';
import { authTokenMiddleware } from '../middlewares/authTokenMiddleware';


const router = express.Router();

router.post('/reg',userController.registerUser)
router.post('/log', userController.loginUser)
router.get('/:id',authTokenMiddleware, userController.getUserById)

export default router