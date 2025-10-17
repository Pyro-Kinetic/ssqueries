import express from 'express'
import {getQuestions} from "../controllers/questionsControllers.js";

export const questionsRouter = express.Router()

//api/questions/data
questionsRouter.get('/data', getQuestions)