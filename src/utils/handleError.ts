import {  NotFoundError, ValidationError } from "./errors";
import { responseHandler } from "./responseHandler";
import { Response } from 'express';

  /**
   * Handles errors and sends a standardized response.
   */
  export function handleError(res: Response, error: unknown): void {
    if (error instanceof ValidationError) {
      responseHandler(res, 400, 'Validation failed');
    } else if (error instanceof NotFoundError) {
      responseHandler(res, 404,error.message ?error.message : 'Resource not found');
    } else if (error instanceof Error) {
      responseHandler(res, 500, error.message ?error.message :'Internal server error');
    } else {
      responseHandler(res, 500, 'Unknown error occurred');
    }
  }
