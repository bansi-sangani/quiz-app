import { Request, Response } from 'express';
import { InMemoryDatabase } from '../database/InMemoryDatabase';
import { QuizService } from '../services/QuizService';
import { responseHandler } from '../utils/responseHandler'; // Import utility
import { handleError } from '../utils/handleError';

const db = InMemoryDatabase.getInstance();
/**
 * Controller for handling operations related to answers.
 */
export class AnswerController {
  private quizService: QuizService;

  constructor() {
    this.quizService = new QuizService(db);  // Service instance
  }

  /**
   * Submits an answer for a quiz question.
   * - Validates and processes the submitted answer.
   * - Returns feedback indicating whether the answer was correct.
   * @param req - Express request object containing quizId, userId, questionId, and selectedOption in the body.
   * @param res - Express response object for sending the response.
   */
  async submit(req: Request, res: Response): Promise<void> {
    try {
      const { questionId, userId, quizId, selectedOption } = req.body;
  
      const feedback = await this.quizService.submitAnswer(quizId, userId, questionId, selectedOption);
      responseHandler(res, 200, 'Answer submitted successfully', feedback);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Retrieves the results of a specific quiz.
   * - Fetches all user results for the given quiz ID.
   * @param req - Express request object containing the quiz ID in params.
   * @param res - Express response object for sending the response.
   */
  async getResults(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.quizService.getResults(req.params.id);
      responseHandler(res, 200, 'Results retrieved successfully', result);
    } catch (error) {
      handleError(res, error);
    }
  }
}
