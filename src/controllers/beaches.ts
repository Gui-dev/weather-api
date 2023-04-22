import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

@Controller('beaches')
export class BeachesController {
  @Post('')
  public async create (request: Request, response: Response): Promise<Response> {
    return response.status(201).send({ ...request.body, id: 'fake_id' })
  }
}
