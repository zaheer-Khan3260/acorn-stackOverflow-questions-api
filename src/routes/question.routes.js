import { Router } from "express";
import { createQuestion, deleteQuestion, getQuestionById, fetchQuestion, updateQuestion } from "../controllers/question.controller.js";

const router = Router();

router.post("/", createQuestion);
router.get("/", fetchQuestion);
router.get("/:id", getQuestionById);
router.put("/", updateQuestion)
router.delete("/", deleteQuestion)

export default router;