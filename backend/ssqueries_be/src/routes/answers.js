import express from "express";
import {getAnswers, addAnswer} from "../controllers/answersControllers.js";

export const answersRouter = express.Router()

//api/answers/data
answersRouter.get('/data', getAnswers)

//api/answers/add
answersRouter.post('/add', addAnswer)