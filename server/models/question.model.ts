import { QuestionType, Rank } from "../utils/enum";

export interface Answer {
  answer: string;
  correct: boolean;
}

export interface Question {
  _id: string;
  title?: string;
  image_url?: string;
  type: QuestionType;
  rank: Rank;
  answer: string | Answer[];
}
