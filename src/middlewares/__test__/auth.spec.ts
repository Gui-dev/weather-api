import { type Response, type Request } from 'express'

import { AuthService } from '@src/services/auth-service'
import { authMiddleware } from '../auth'

describe('#AuthMiddleware', () => {
  it('should verify a JWT and call the next middleware', async () => {
    const jwt = AuthService.generateToken({ data: 'fake-data' })
    const requestFake: Partial<Request> = {
      headers: {
        'x-access-token': jwt
      }
    }
    const responseFake: Partial<Response> = {}
    const nextFake = jest.fn()
    authMiddleware(requestFake, responseFake, nextFake)

    expect(nextFake).toHaveBeenCalled()
  })

  it('should return UNAUTHORIZED if there is a problem on the token verification', async () => {
    const requestFake: Partial<Request> = {
      headers: {
        'x-access-token': 'fake_token'
      }
    }
    const sendMock = jest.fn()
    const responseFake = {
      status: jest.fn(() => ({
        send: sendMock
      }))
    }
    const nextFake = jest.fn()
    authMiddleware(requestFake, responseFake as object, nextFake)
    expect(responseFake.status).toHaveBeenCalledWith(401)
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt malformed'
    })
  })
})
