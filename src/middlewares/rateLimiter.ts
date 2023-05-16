import { type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'

import { APIError } from '@src/errors/api-errors'

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  keyGenerator (request: Request): string {
    return request.ip
  },
  handler (request: Request, response: Response): void {
    response.status(429).send(APIError.format({
      code: 429,
      message: 'Too many requests to the /forecast endpoint'
    }))
  }
})
