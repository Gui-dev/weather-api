import { Controller, Get, Middleware, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import type mongoose from 'mongoose'

import { User } from '@src/models/user-model'
import { BaseController } from '.'
import { AuthService } from '@src/services/auth-service'
import { authMiddleware } from '@src/middlewares/auth'

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create (request: Request, response: Response): Promise<Response | any> {
    try {
      const user = new User(request.body)
      const newUser = await user.save()
      return response.status(201).send(newUser)
    } catch (err) {
      const error = err as mongoose.Error.ValidationError | Error
      this.sendCreatedUpdateErrorResponse(response, error)
    }
  }

  @Post('authenticate')
  public async authenticate (request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body
    const user = await User.findOne({ email })
    if (!user) {
      return this.sendErrorResponse(response, {
        code: 401,
        message: 'User or password is invalid'
      })
    }
    if (!(await AuthService.comparePassword(password, user.password))) {
      return this.sendErrorResponse(response, {
        code: 401,
        message: 'User or password is invalid'
      })
    }
    const token = AuthService.generateToken(user.toJSON())

    return response.status(200).send({ token })
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me (request: Request, response: Response): Promise<Response> {
    const email = request.decoded?.email
    const user = await User.findOne({ email })
    if (!user) {
      return this.sendErrorResponse(response, {
        code: 404,
        message: 'User not found!'
      })
    }
    return response.status(200).send({ user })
  }
}
