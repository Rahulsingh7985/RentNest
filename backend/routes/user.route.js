import express from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';
import isAuth from '../middleware/isAuth.middleware.js';

const userRouter = express.Router();

userRouter.get("/currentuser",isAuth, getCurrentUser);

export default userRouter;