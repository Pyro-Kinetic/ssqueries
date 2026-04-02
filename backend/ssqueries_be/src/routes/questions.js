import express from 'express'
import {addQuestion, deleteQuestion, getQuestions} from "../controllers/questionsControllers.js";
import {requireSession} from "../middleware/requireSession.js";

export const questionsRouter = express.Router()

//api/questions/data
questionsRouter.get('/data', getQuestions)

//api/questions/add
questionsRouter.post('/add', requireSession, addQuestion)

//api/questions/delete/:id
questionsRouter.delete('/delete/:id', requireSession, deleteQuestion)