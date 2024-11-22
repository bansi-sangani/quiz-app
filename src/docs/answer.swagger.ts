/**
 * @swagger
 * tags:
 *   name: Answers
 *   description: Answer management
 */

/**
 * @swagger
 * /quizzes/answers:
 *   post:
 *     summary: Submit an answer for a specific question
 *     tags:
 *       - Answers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quizId:
 *                 type: string
 *               userId:
 *                 type: string
 *               questionId:
 *                 type: string
 *               selectedOption:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isCorrect:
 *                   type: boolean
 *                 correctOption:
 *                   type: integer
 *       404:
 *         description: Quiz or question not found
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /quizzes/{id}/results:
 *   get:
 *     summary: Get results for a specific quiz
 *     tags:
 *       - Answers
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the quiz
 *     responses:
 *       200:
 *         description: Quiz results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: string
 *                   score:
 *                     type: integer
 *                   answers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         question_id:
 *                           type: string
 *                         selected_option:
 *                           type: integer
 *                         is_correct:
 *                           type: boolean
 *       404:
 *         description: Results not found
 */
