import { Router } from "express";
import { createQuestion, deleteQuestion, getQuestionById, getQuestions, updateQuestion } from "../controllers/question.controller";

const router = Router();

router.post("/", createQuestion);
router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.put("/", updateQuestion)
router.delete("/", deleteQuestion)

export default router;