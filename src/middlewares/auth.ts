import { AuthService } from '@src/services/auth-service'
import { type Response, type Request, type NextFunction } from 'express'

export const authMiddleware = (request: Partial<Request>, response: Partial<Response>, next: NextFunction): void => {
  try {
    const token = request.headers?.['x-access-token']
    const claims = AuthService.decodeToken(token as string)
    request.decoded = { userId: claims.sub }
    next()
  } catch (err) {
    const error = err as Error
    response.status?.(401).send({
      code: 401,
      error: error.message
    })
  }
}
