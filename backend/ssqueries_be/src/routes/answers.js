import express from "express";
import {addAnswer, getAnswers} from "../controllers/answersControllers.js";
import {requireSession} from "../middleware/requireSession.js";

export const answersRouter = express.Router()

//api/answers/data
answersRouter.get('/data', getAnswers)

//api/answers/add
answersRouter.post('/add', requireSession, addAnswer)