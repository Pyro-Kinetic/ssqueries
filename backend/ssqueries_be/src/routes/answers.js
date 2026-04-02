import express from "express";
import {addAnswer, deleteAnswer, getAnswers} from "../controllers/answersControllers.js";
import {requireSession} from "../middleware/requireSession.js";

export const answersRouter = express.Router()

//api/answers/data
answersRouter.get('/data', getAnswers)

//api/answers/add
answersRouter.post('/add', requireSession, addAnswer)

//api/answers/delete/:id
answersRouter.delete('/delete/:id', requireSession, deleteAnswer)