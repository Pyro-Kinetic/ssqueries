import express from "express";
import {getAnswers} from "../controllers/answersControllers.js";

export const answersRouter = express.Router()

//api/answers/data
answersRouter.get('/data', getAnswers)