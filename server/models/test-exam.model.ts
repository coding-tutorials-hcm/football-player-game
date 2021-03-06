import { Question } from "./question.model";
import { Rank, QuestionType } from "../utils/enum";

export interface TestExam {
  _id: string;
  questions: Array<Question>;
  rank: Rank;
  count: number;
}
