// Quiz Model
export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

// Question Model
export interface Question {
  id: string;
  text: string;
  options: string[];
  correct_option: number;
}

// Answer Model
export interface Answer {
  question_id: string;
  selected_option: number;
  is_correct: boolean;
}

// Result Model
export interface Result {
  quiz_id: string;
  user_id: string;
  score: number;
  answers: Answer[];
}
