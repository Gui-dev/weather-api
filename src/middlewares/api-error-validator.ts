import { type NextFunction, type Request, type Response } from 'express'
import { APIError } from '@src/errors/api-errors'

export interface IHTTPError extends Error {
  status?: number
}

export const apiErrorValidator = (
  error: IHTTPError,
  request: Partial<Request>,
  response: Response,
  next: NextFunction
): void => {
  const errorCode = error.status ?? 500
  response.status(errorCode).send(APIError.format({
    code: errorCode,
    message: error.message
  }))
}
