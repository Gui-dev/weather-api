import { ClassMiddleware, Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

import { Beach } from '@src/models/beaches-model'
import { authMiddleware } from '@src/middlewares/auth'
import { BaseController } from '.'

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
  @Post('')
  public async create (request: Request, response: Response): Promise<void> {
    try {
      const beach = new Beach({ ...request.body, ...{ user: request.decoded?.id } })
      const result = await beach.save()
      response.status(201).send(result)
    } catch (err) {
      const error = err as Error
      this.sendCreatedUpdateErrorResponse(response, error)
    }
  }
}
