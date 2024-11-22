import { Result, Quiz } from "../entities/Quiz";

export class InMemoryDatabase {
  private results: Map<string, Result[]> = new Map();
  private quizzes: Map<string, Quiz> = new Map();
  private static instance: InMemoryDatabase;

  private constructor() {}

  public static getInstance(): InMemoryDatabase {
    if (!InMemoryDatabase.instance) {
      InMemoryDatabase.instance = new InMemoryDatabase();
    }
    return InMemoryDatabase.instance;
  }

  // Quiz operations
  createQuiz(quiz: Quiz): Quiz {
    this.quizzes.set(quiz.id, quiz);
    return quiz;
  }

  getQuiz(id: string): Quiz | undefined {
    return this.quizzes.get(id);
  }

  getAllQuizzes(): Quiz[] {
    return Array.from(this.quizzes.values());
  }

  // Result operations
  saveResults(quiz_id: string, results: Result[]): void {
    this.results.set(quiz_id, results);
  }

  getResults(quiz_id: string): Result[] | undefined {
    return this.results.get(quiz_id);
  }
}
