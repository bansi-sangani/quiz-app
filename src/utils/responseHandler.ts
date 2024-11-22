import { log } from 'console';
import { Response } from 'express';

export const responseHandler = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = null
): void => {
  res.status(statusCode).json({
    data,
    status: {
      code: statusCode,
      message,
    },
  });
};
