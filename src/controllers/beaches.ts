import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

import { Beach } from '@src/models/beaches-model'

@Controller('beaches')
export class BeachesController {
  @Post('')
  public async create (request: Request, response: Response): Promise<Response> {
    const beach = new Beach(request.body)
    const result = await beach.save()
    return response.status(201).send(result)
  }
}
