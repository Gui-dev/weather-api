import { AuthService } from '@src/services/auth-service'
import { type Response, type Request, type NextFunction } from 'express'

export const authMiddleware = (request: Partial<Request>, response: Partial<Response>, next: NextFunction): void => {
  const token = request.headers?.['x-access-token']
  const decoded = AuthService.decodeToken(token as string)
  request.decoded = decoded

  next()
}
