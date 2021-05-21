import { Answer } from "./question.model";
import { TestExam } from "./test-exam.model";

interface TestExamHistory {
  timeStart: number;
  timeEnd: number;
  testExam: TestExam;
  answers: Array<Answer>;
  point?: number;
}

export interface User {
  displayName?: string;
  email?: string;
  _id: string;
  photoURL?: string;
  rank?: number | 0;
  point?: number | 0;
  testExamHistory?: Array<TestExamHistory>;
  timeCreate?: string;
}
