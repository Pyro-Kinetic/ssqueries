import express from 'express'
import {getUsers} from '../controllers/usersControllers.js'

export const usersRouter = express.Router()

//api/users/data
usersRouter.get('/data', getUsers)