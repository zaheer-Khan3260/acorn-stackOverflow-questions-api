import axios from "axios";
import mongoose from "mongoose";
import { Question } from "../models/questions.model.js";
import { Owner } from "../models/owner.models.js";


export async function fetchAndSaveQuestions() {
  try {
    // Fetch data from the API
    const response = await axios.get(process.env.STACKOVERFLOW_API_URL, {
      params: {
        order: "desc",
        sort: "activity",
        site: "stackoverflow",
        pagesize: 100,
      }
    });

    const questions = response.data.items;

    for (const question of questions) {
      let owner = await Owner.findOne({ user_id: question.owner.user_id });

      if (!owner) {
        owner = new Owner(question.owner);
        await owner.save();
      }

      const questionData = {
        question_id: question.question_id,
        title: question.title,
        tags: question.tags,
        is_answered: question.is_answered,
        view_count: question.view_count,
        answer_count: question.answer_count,
        score: question.score,
        closed_date: question.closed_date
          ? new Date(question.closed_date * 1000)
          : null,
        last_activity_date: new Date(question.last_activity_date * 1000),
        creation_date: new Date(question.creation_date * 1000),
        last_edit_date: question.last_edit_date
          ? new Date(question.last_edit_date * 1000)
          : null,
        link: question.link,
        closed_reason: question.closed_reason,
        owner: owner._id 
      };

      const existingQuestion = await Question.findOne({
        question_id: question.question_id
      });

      if (!existingQuestion) {
        const newQuestion = new Question(questionData);
        await newQuestion.save();
      }
    }

    console.log("Data successfully saved!");
  } catch (error) {
    console.error("Error fetching or saving data:", error);
  }
}


