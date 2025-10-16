import express from 'express'
import { registerUser } from "../controllers/authController.js";

export const authRouter = express.Router()

//api/register/user
authRouter.post('/user', registerUser)