import { Router } from "express";

// Controller
import * as questionController from "../controllers/question.controller";

class QuestionsRoutes {
  public routes: Router;

  constructor() {
    this.routes = Router();
    this._init();
  }

  _init() {
    this.routes.get("/", questionController.getAllquestion);
    this.routes.get("/:questionId", questionController.getQuestionByID);
    this.routes.post("/", questionController.createQuestion);
    this.routes.patch("/:questionId", questionController.updateQuestionById);
    this.routes.delete("/:questionId", questionController.deleteQuestionById);

    this.routes.post(
      "/test-exam",
      questionController.getTestExamByRankAndCount
    );
  }
}

export const questionsRoutes = new QuestionsRoutes().routes;
