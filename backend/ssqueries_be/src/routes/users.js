import express from 'express'
import {getUsers} from '../controllers/usersControllers.js'

//ssqueries/users
export const usersRouter = express.Router()

usersRouter.get('/data', getUsers)