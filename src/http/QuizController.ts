import { Request, Response } from 'express';
import { InMemoryDatabase } from '../database/InMemoryDatabase';
import { QuizService } from '../services/QuizService';
import { responseHandler } from '../utils/responseHandler';
import { handleError } from '../utils/handleError';
import { log } from 'console';
const db = InMemoryDatabase.getInstance();

/**
 * Controller for handling operations related to quizzes.
 */
export class QuizController {
private quizService: QuizService;

  constructor() {
    this.quizService = new QuizService(db);  // Service instance
  }

  /**
   * Creates a new quiz.
   * - Validates the input data (title and questions).
   * - Saves the new quiz to the database.
   * @param req - Express request object containing the quiz title and questions in the body.
   * @param res - Express response object for sending the response.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, questions } = req.body;
      const quiz = await this.quizService.createQuiz(title, questions);
      responseHandler(res, 201, 'Quiz created successfully', quiz);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Fetches a quiz by its ID.
   * - Excludes the correct answers from the response for security reasons.
   * @param req - Express request object containing the quiz ID in params.
   * @param res - Express response object for sending the response.
   */
  async getQuiz(req: Request, res: Response): Promise<void> {
    try {
      const quiz = await this.quizService.getQuizById(req.params.id);
      // Remove the correct options from the questions for fairness
      const sanitizedQuiz = {
        ...quiz,
        questions: quiz?.questions.map(({ correct_option, ...q }) => q), // Exclude correct options
      };
      responseHandler(res, 200, 'Quiz retrieved successfully', sanitizedQuiz);
    } catch (error) {
      handleError(res, error);
    }
  }
}