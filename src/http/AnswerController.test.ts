import request from 'supertest';
import express from 'express';
import { QuizService } from '../services/QuizService';
import { AnswerController } from './AnswerController';
import { InMemoryDatabase } from '../database/InMemoryDatabase';
import { NotFoundError, ValidationError } from '../utils/errors';
import { Result } from '../entities/Quiz';

jest.mock('../database/InMemoryDatabase');
jest.mock('../services/QuizService');

describe('AnswerController', () => {
  let app: express.Express;
  let quizServiceMock: jest.Mocked<QuizService>;
  let db: InMemoryDatabase;
  let answerController: AnswerController;

  beforeEach(() => {
    db = InMemoryDatabase.getInstance();
    quizServiceMock = new QuizService(db) as jest.Mocked<QuizService>;
    answerController = new AnswerController();
    (answerController as any).quizService = quizServiceMock;

    app = express();
    app.use(express.json());
    app.post('/quizzes/answers', answerController.submit.bind(answerController));
    app.get('/quizzes/:id/results', answerController.getResults.bind(answerController));
  });

  it('should submit an answer successfully', async () => {
    const requestData = {
      quizId: '123',
      userId: 'user1',
      questionId: 'q1',
      selectedOption: 1,
    };
  
    quizServiceMock.submitAnswer.mockResolvedValue({
      isCorrect: true,
      correctOption: 1,
    });
    const response = await request(app).post('/quizzes/answers').send(requestData);
  
    // // Assertions
    expect(response.status).toBe(200);
    expect(response.body.status.message).toBe('Answer submitted successfully');
    expect(response.body.data).toEqual({
      isCorrect: true,
      correctOption: 1,
    });
  });
  it('should return 400 if required fields are missing', async () => {
    quizServiceMock.submitAnswer.mockRejectedValue(new ValidationError('Validation failed'));
    const response = await request(app).post('/quizzes/answers').send({
      quizId: '123', // Missing userId, questionId, and selectedOption
    });
    expect(response.status).toBe(400);
    expect(response.body.status.message).toBe('Validation failed');
  });
  it('should return 400 if data types are invalid', async () => {
    quizServiceMock.submitAnswer.mockRejectedValue(new ValidationError('Validation failed'));
    const response = await request(app).post('/quizzes/answers').send({
      quizId: 123, // Should be a string
      userId: 'user1',
      questionId: 'q1',
      selectedOption: 'one', // Should be a number
    });
  
    expect(response.status).toBe(400);
    expect(response.body.status.message).toBe('Validation failed');
  });
  it('should return 404 if the quiz does not exist', async () => {
    quizServiceMock.submitAnswer.mockRejectedValue(new NotFoundError('Quiz not found'));
  
    const response = await request(app).post('/quizzes/answers').send({
      quizId: 'non-existent',
      userId: 'user1',
      questionId: 'q1',
      selectedOption: 1,
    });
  
    expect(response.status).toBe(404);
    expect(response.body.status.message).toBe('Quiz not found');
  });
  it('should retrieve quiz results successfully', async () => {
    const mockResults: Result[] = [
      {
        quiz_id: '123',
        user_id: 'user1',
        score: 80,
        answers: [
          { question_id: 'q1', selected_option: 1, is_correct: true },
          { question_id: 'q2', selected_option: 3, is_correct: false },
        ],
      },
    ];
    quizServiceMock.getResults.mockResolvedValue(mockResults);
    const response = await request(app).get('/quizzes/123/results');
    expect(response.status).toBe(200);
    expect(response.body.status.message).toBe('Results retrieved successfully');
    expect(response.body.data).toEqual(mockResults);
    expect(quizServiceMock.getResults).toHaveBeenCalledWith('123');
  });
  it('should return 404 if quiz does not exist', async () => {
    quizServiceMock.getResults.mockRejectedValue(new NotFoundError('Quiz not found'));
  
    const response = await request(app).get('/quizzes/999/results');
  
    expect(response.status).toBe(404);
    expect(response.body.status.message).toBe('Quiz not found');
  });
});
