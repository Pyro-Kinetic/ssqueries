import express from 'express'
import {getQuestions } from "../controllers/questionsControllers.js";

//ssqueries/questions
export const questionsRouter = express.Router()

questionsRouter.get('/data', getQuestions)