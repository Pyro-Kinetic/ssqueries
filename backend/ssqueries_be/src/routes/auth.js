import express from 'express'
import {loginUser, logoutUser, registerUser, sessionStatus} from "../controllers/authController.js";

export const authRouter = express.Router()

//api/auth/register/user
authRouter.post('/register/user', registerUser)

//api/auth/login/user
authRouter.post('/login/user', loginUser)

//api/auth/logout/user
authRouter.get('/logout/user', logoutUser)

//api/auth/session
authRouter.get('/session', sessionStatus)