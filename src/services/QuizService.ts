import { Quiz, Result, Answer } from '../entities/Quiz';
import { v4 as uuidv4 } from 'uuid';
import { validateOrReject } from 'class-validator';
import { NotFoundError, ValidationError } from '../utils/errors';
import { CreateQuizDTO } from '../dto/CreateQuizDTO';
import { SubmitAnswerDTO } from '../dto/SubmitAnswerDTO';
import { InMemoryDatabase } from '../database/InMemoryDatabase';

/**
 * Service to manage quiz-related operations, such as creating quizzes,
 * submitting answers, fetching quizzes, and retrieving results.
 */
export class QuizService {
  constructor(private readonly db: InMemoryDatabase) {}

  /**
   * Creates a new quiz after validating the input data.
   * - Each question is assigned a unique ID.
   * @param title - The title of the quiz.
   * @param questions - An array of questions (excluding their IDs).
   * @returns A Promise that resolves to the created quiz object.
   * @throws ValidationError if input data is invalid.
   */
  async createQuiz(title: string, questions: Omit<Quiz['questions'][0], 'id'>[]): Promise<Quiz> {
    // Validate input using CreateQuizDTO
    const dto = new CreateQuizDTO();
    Object.assign(dto, { title, questions });
    try {
      // Validate input using CreateQuizDTO
      await validateOrReject(dto);
    } catch (errors) {
      throw new ValidationError(`Validation failed`);
    }



    // Generate unique IDs for the quiz and its questions
    const quiz: Quiz = {
      id: uuidv4(),
      title,
      questions: questions.map((q) => ({ ...q, id: uuidv4() })),
    };

    // Save the quiz to the database
    return this.db.createQuiz(quiz);
  }

  /**
   * Retrieves a quiz by its unique ID.
   * @param id - The unique ID of the quiz.
   * @returns The quiz object if found.
   * @throws NotFoundError if the quiz does not exist.
   */
  getQuizById(id: string): Promise<Quiz> {
    
    return Promise.resolve(this.fetchQuizOrThrow(id));
  }

  /**
   * Submits an answer for a specific question in a quiz and updates the user's results.
   * - Validates the submission.
   * - Determines correctness of the selected answer.
   * - Updates or initializes the user's score and answers in the quiz result.
   * @param quizId - The unique ID of the quiz.
   * @param userId - The unique ID of the user.
   * @param questionId - The unique ID of the question being answered.
   * @param selectedOption - The option selected by the user (0-based index).
   * @returns A Promise that resolves to an object indicating whether the answer was correct and the correct option.
   * @throws NotFoundError if the quiz or question does not exist.
   * @throws ValidationError if the input data is invalid.
   */
 async submitAnswer(
  quizId: string,
  userId: string,
  questionId: string,
  selectedOption: number
): Promise<{ isCorrect: boolean; correctOption: number }> {
  // DTO validation
  const dto = new SubmitAnswerDTO();
  Object.assign(dto, { quizId, userId, questionId, selectedOption });
  try {
    // Validate input using CreateQuizDTO
    await validateOrReject(dto);
  } catch (errors) {
    throw new ValidationError(`Validation failed`);
  }

  // Fetch the quiz and question
  const quiz = this.fetchQuizOrThrow(quizId);
  const question = this.fetchQuestionOrThrow(quiz, questionId);

  // Determine correctness
  const isCorrect = question.correct_option === selectedOption;

  // Update user result
  this.updateResult(quizId, userId, questionId, selectedOption, isCorrect);

  // Return feedback
  return { isCorrect, correctOption: question.correct_option };
}

  

  /**
   * Retrieves the results of a quiz by its unique ID.
   * @param quizId - The unique ID of the quiz.
   * @returns An array of results for the quiz, or an empty array if no results exist.
   * @throws NotFoundError if the quiz does not exist.
   */
  getResults(quizId: string): Promise<Result[]> {
    const quiz = this.db.getQuiz(quizId);
    if (!quiz) {
      throw new NotFoundError(`Quiz not found`);
    }
    return  Promise.resolve(this.db.getResults(quizId) || []);
  }

  /**
   * Fetches a quiz by its ID or throws an error if it does not exist.
   * @param quizId - The unique ID of the quiz.
   * @returns The quiz object.
   * @throws NotFoundError if the quiz is not found.
   */
  private fetchQuizOrThrow(quizId: string): Quiz {
    const quiz = this.db.getQuiz(quizId);
    if (!quiz) {
      throw new NotFoundError(`Quiz not found`);
    }
    return quiz;
  }

  /**
   * Fetches a question from a quiz by its unique ID or throws an error if it does not exist.
   * @param quiz - The quiz object containing the questions.
   * @param questionId - The unique ID of the question.
   * @returns The question object.
   * @throws NotFoundError if the question is not found in the quiz.
   */
  private fetchQuestionOrThrow(quiz: Quiz, questionId: string) {
    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new NotFoundError(`Question not found`);
    }
    return question;
  }

  /**
   * Updates or initializes the result for a user in a quiz.
   * - Updates the score based on the correctness of the answer.
   * - Handles duplicate answers by replacing the previous answer.
   * @param quizId - The unique ID of the quiz.
   * @param userId - The unique ID of the user.
   * @param questionId - The unique ID of the question being answered.
   * @param selectedOption - The option selected by the user (0-based index).
   * @param isCorrect - Whether the selected option is correct.
   * @returns The updated result object for the user.
   */
  private updateResult(
    quizId: string,
    userId: string,
    questionId: string,
    selectedOption: number,
    isCorrect: boolean
  ): Result {
    // Retrieve or initialize all results for the quiz
    const allResults = this.db.getResults(quizId) || [];
    let userResult = allResults.find((result) => result.user_id === userId);

    if (!userResult) {
      // Initialize a new result if the user does not have an existing result
      userResult = {
        quiz_id: quizId,
        user_id: userId,
        score: 0,
        answers: [],
      };
      allResults.push(userResult);
    }

    // Check if the user has already answered this question
    const existingAnswerIndex = userResult.answers.findIndex(
      (answer) => answer.question_id === questionId
    );

    if (existingAnswerIndex !== -1) {
      const previousAnswer = userResult.answers[existingAnswerIndex];

      // Adjust the score if the previous answer was correct
      if (previousAnswer.is_correct) {
        userResult.score -= 1;
      }

      // Update the existing answer
      userResult.answers[existingAnswerIndex] = {
        question_id: questionId,
        selected_option: selectedOption,
        is_correct: isCorrect,
      };
    } else {
      // Add a new answer for the question
      userResult.answers.push({
        question_id: questionId,
        selected_option: selectedOption,
        is_correct: isCorrect,
      });
    }

    // Adjust the score based on the correctness of the new answer
    if (isCorrect) {
      userResult.score += 1;
    }

    // Persist the updated results in the database
    this.db.saveResults(quizId, allResults);

    return userResult;
  }
}
