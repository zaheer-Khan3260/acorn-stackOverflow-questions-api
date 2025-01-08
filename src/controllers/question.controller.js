import mongoose from "mongoose";
import { Question } from "../models/questions.model.js";
import { ApiError} from "../utils/ApiError.js"
import { ApiResponse} from "../utils/ApiResponse.js"


// GET /questions
export const fetchQuestion = asyncHandler(async(req, res) => {
    try {
      const {
        is_answered,
        tags,
        answers_count__gt,
        answers_count__lt,
        sort,
        page = 1,
        limit = 10
      } = req.query;
  

      const pipeline = [];
  
      if (is_answered !== undefined) {
        pipeline.push({ $match: { is_answered: is_answered === "true" } });
      }
  
      if (tags) {
        const tagsArray = tags.split(","); 
        pipeline.push({ $match: { tags: { $all: tagsArray } } });
      }
  
      if (answers_count__gt) {
        pipeline.push({ $match: { answer_count: { $gt: parseInt(answers_count__gt) } } });
      }
  
      if (answers_count__lt) {
        pipeline.push({ $match: { answer_count: { $lt: parseInt(answers_count__lt) } } });
      }
  
      if (sort === "score") {
        pipeline.push({ $sort: { score: -1 } }); 
      } else if (sort === "created_at") {
        pipeline.push({ $sort: { creation_date: -1 } });
      }
  
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: parseInt(limit) });
  
      const questions = await Question.aggregate(pipeline);
  
      const totalCountPipeline = pipeline.filter(stage => !stage.$skip && !stage.$limit);
      totalCountPipeline.push({ $count: "total" });
  
      const totalResult = await Question.aggregate(totalCountPipeline).populate("owner");
      const totalCount = totalResult.length > 0 ? totalResult[0].total : 0;
  
      res.status(200).json(
        new ApiResponse({
          status: 200,
          data: {
          questions,
          meta: {
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalCount / limit)
          }},
          message: "Questions fetched successfully"
        })
        );
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
});

export const createQuestion = asyncHandler(async(req, res) => {
  try {
    const { title, tags } = req.body;

    if (!title || !tags) {
      return res.status(400).json({
        success: false,
        message: "Title, tags and user are required"
      });
    }

    const question = new Question({
      question_id: Date.now(), 
      title,
      tags,
      is_answered: false,
      view_count: 0,
      answer_count: 0, 
      score: 0,
      last_activity_date: new Date(),
      creation_date: new Date(),
      link: `${process.env.BASE_URL}/questions/${Date.now()}`,
    });

    await question.save();

    res.status(201).json(
      new ApiResponse(
        201,
        question,
        "Question created successfully"
      )
    );

  } catch (error) {
    console.error("Error creating question:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json(
        400,
        "Validation Error",
        Object.values(error.errors).map(err => err.message)
      );
    }
    

    res.status(500).json(
      new ApiResponse(
        500,
        null,
        "Internal Server Error"
      )
    );
  }
});



export const getQuestionById = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;

        if(!id){
            throw new ApiError(400, "Question ID is required");
        }
        const question = await Question.findOne({ question_id: id }).populate("owner");

        if (!question) {
            throw new ApiError(404, "Question not found");
        }

        res.status(200).json(
            new ApiResponse({
                status: 200,
                data: question,
                message: "Question fetched successfully"
            })
        );

    } catch (error) {
        console.error("Error fetching question:", error);
        res.status(500).json(
            new ApiResponse({
                status: 500,
                success: false,
                message: "Internal Server Error",
                error: error.message
            })
          );
    }
});


export const updateQuestion = asyncHandler(async(req, res) => {
  try {
    const { id } = req.params;
    const { title, tags } = req.body;
    
    if (!id ||!title ||!tags) {
      throw new ApiError(400, "Title, tags and user are required");
    } 
    const question = await Question.findOneAndUpdate({question_id:id}, { title, tags }, { new: true }).populate("owner");
    
    if (!question) {
      throw new ApiError(404, "Question not found");
    }
    
    res.status(200).json(
      new ApiResponse({
        status: 200,
        data: question,
        message: "Question updated successfully"
      })
    );
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json(
      new ApiResponse({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: error.message
      })
    );
  }
});


export const deleteQuestion = asyncHandler(async(req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new ApiError(400, "Question ID is required");
    }
    
    const question = await Question.findOneAndDelete({question_id:id});
    
    if (!question) {
      throw new ApiError(404, "Question not found");
    }
    
    res.status(200).json(
      new ApiResponse({
        status: 200,
        data: question,
        message: "Question deleted successfully"
      })
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json(
      new ApiResponse({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: error.message
      })
    );
  }
});





