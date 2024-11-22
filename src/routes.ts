import express from 'express';
import { QuizController } from './http/QuizController';
import { AnswerController } from './http/AnswerController';

const router = express.Router();
const quizController = new QuizController();
const answerController = new AnswerController();

router.post('/quizzes', (req, res) => quizController.create(req, res));

router.get('/quizzes/:id', (req, res) => quizController.getQuiz(req, res));
router.post('/quizzes/answers', (req, res) => answerController.submit(req, res));
router.get('/quizzes/:id/results', (req, res) => answerController.getResults(req, res));

export default router;
