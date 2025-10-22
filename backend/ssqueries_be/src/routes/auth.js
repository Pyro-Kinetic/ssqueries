import express from 'express'
import {loginUser, logoutUser, registerUser, sessionStatus} from "../controllers/authController.js";

export const authRouter = express.Router()

//api/auth/register/user
authRouter.get('/register/user', (req, res) => {
    res.status(405).json({error: 'Method Not Allowed. Use POST to register.'})
})
authRouter.post('/register/user', registerUser)

//api/auth/login/user
authRouter.get('/login/user', (req, res) => {
    return res.status(405).json({error: 'Method Not Allowed. Use POST to login.'})
})
authRouter.post('/login/user', loginUser)

//api/auth/logout/user
authRouter.get('/logout/user', logoutUser)

//api/auth/session
authRouter.get('/session', sessionStatus)