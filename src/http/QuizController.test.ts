import request from 'supertest';
import express from 'express';
import { InMemoryDatabase } from '../database/InMemoryDatabase';
import { QuizService } from '../services/QuizService';
import { QuizController } from './QuizController';
import { NotFoundError, ValidationError } from '../utils/errors';

jest.mock('../database/InMemoryDatabase');
jest.mock('../services/QuizService');

describe('QuizController', () => {
  let app: express.Express;
  let quizController: QuizController;
  let db: InMemoryDatabase;
  let quizServiceMock: jest.Mocked<QuizService>;

  beforeEach(() => {
    db = InMemoryDatabase.getInstance();
    quizServiceMock = new QuizService(db) as jest.Mocked<QuizService>;

    quizController = new QuizController();
    (quizController as any).quizService = quizServiceMock;

    app = express();
    app.use(express.json());
    app.post('/quizzes', quizController.create.bind(quizController));
    app.get('/quizzes/:id', quizController.getQuiz.bind(quizController));
  });

  describe('POST /quizzes', () => {
    it('should create a quiz successfully', async () => {
      const quizData = {
        title: 'Sample Quiz',
        questions: [
          {
            id: 'question-1',
            text: 'What is 2 + 2?',
            options: ['2', '4', '6'],
            correct_option: 1
          }
        ]
      };
      quizServiceMock.createQuiz.mockResolvedValue({
        id: '123',
        title: 'Sample Quiz',
        questions: [{ id: 'q1', text: 'What is 2 + 2?', options: ['2', '4', '6'], correct_option: 1 }]
      });
      
      const response = await request(app).post('/quizzes').send(quizData);

      expect(response.body.status.code).toBe(201);
      expect(response.body.status.message).toBe('Quiz created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Sample Quiz');
    });
    it('should return a 400 error when quiz creation fails due to validation error', async () => {
      quizServiceMock.createQuiz.mockRejectedValue(new ValidationError('Validation failed'));
    
      const quizData = {
        title: '', // Invalid title to trigger validation error
        questions: [],
      };
    
      const response = await request(app).post('/quizzes').send(quizData);
      expect(response.status).toBe(400);
      expect(response.body.status.message).toBe('Validation failed');
    });
    
  });

  describe('GET /quizzes/:id', () => {
    it('should retrieve a quiz by ID successfully', async () => {
      quizServiceMock.getQuizById.mockResolvedValue({
        id: '123',
        title: 'Sample Quiz',
        questions: [{ id: 'q1', text: 'What is 2 + 2?', options: ['2', '4', '6'], correct_option: 1 }]
      });
      const response = await request(app).get('/quizzes/123');

      expect(response.body.status.code).toBe(200);
      expect(response.body.status.message).toBe('Quiz retrieved successfully');
      expect(response.body.data).toHaveProperty('id', '123');
      expect(response.body.data.title).toBe('Sample Quiz');
    });

    it('should return a 404 error when quiz is not found', async () => {
      quizServiceMock.getQuizById.mockRejectedValue(new NotFoundError('Quiz not found'));

      const response = await request(app).get('/quizzes/invalid-id');
      expect(response.body.status.code).toBe(404);
      expect(response.body.status.message).toBe('Quiz not found');
    });
  });
});
