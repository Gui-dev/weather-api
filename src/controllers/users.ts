import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import type mongoose from 'mongoose'

import { User } from '@src/models/user-model'
import { BaseController } from '.'

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
}
