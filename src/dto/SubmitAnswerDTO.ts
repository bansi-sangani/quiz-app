import { IsString, IsNotEmpty, IsInt, Min } from "class-validator";
/**
 * @swagger
 * components:
 *   schemas:
 *     SubmitAnswerDTO:
 *       type: object
 *       properties:
 *         quizId:
 *           type: string
 *           description: ID of the quiz
 *         userId:
 *           type: string
 *           description: ID of the user
 *         questionId:
 *           type: string
 *           description: ID of the question
 *         selectedOption:
 *           type: integer
 *           description: Index of the selected option
 */
export class SubmitAnswerDTO {
    @IsString()
    @IsNotEmpty()
    quizId!: string;

    @IsString()
    @IsNotEmpty()
    userId!: string;

    @IsString()
    @IsNotEmpty()
    questionId!: string;

    @IsInt()
    @Min(0)
    selectedOption!: number;
  }