import express from "express";
import {getAnswers} from "../controllers/answersControllers.js";

//queries/answers
export const answersRouter = express.Router()

answersRouter.get('/data', getAnswers)