import express from 'express'
import {getUsers} from '../controllers/usersControllers.js'
import {requireSession} from "../middleware/requireSession.js";

export const usersRouter = express.Router()

//api/users/data
usersRouter.get('/data', requireSession, getUsers)