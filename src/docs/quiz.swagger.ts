/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management
 */

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags:
 *       - Quizzes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correct_option:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Fetch a quiz by ID
 *     tags:
 *       - Quizzes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the quiz
 *     responses:
 *       200:
 *         description: Quiz details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       text:
 *                         type: string
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *       404:
 *         description: Quiz not found
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     QuestionDTO:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           description: The question text.
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: The possible answers for the question.
 *         correct_option:
 *           type: integer
 *           description: The index of the correct option (starting from 0).
 *       required:
 *         - text
 *         - options
 *         - correct_option
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateQuizDTO:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the quiz.
 *         questions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuestionDTO'
 *       required:
 *         - title
 *         - questions
 */
