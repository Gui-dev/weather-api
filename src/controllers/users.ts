import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import type mongoose from 'mongoose'

import { User } from '@src/models/user-model'
import { BaseController } from '.'
import { AuthService } from '@src/services/auth-service'

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
  public async authenticate (request: Request, response: Response): Promise<Response | any> {
    const { email, password } = request.body
    const user = await User.findOne({ email })
    if (!user) {
      return response.status(401).send({
        code: 401,
        error: 'User not found'
      })
    }
    if (!(await AuthService.comparePassword(password, user.password))) {
      return
    }
    const token = AuthService.generateToken(user.toJSON())

    return response.status(200).send({ token })
  }
}
