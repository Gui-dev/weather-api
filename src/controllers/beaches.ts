import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

import { Beach } from '@src/models/beaches-model'

@Controller('beaches')
export class BeachesController {
  @Post('')
  public async create (request: Request, response: Response): Promise<Response> {
    try {
      const beach = new Beach(request.body)
      const result = await beach.save()
      return response.status(201).send(result)
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        const error = err as Error
        return response.status(422).send({
          error: error.message
        })
      } else {
        return response.status(500).send({
          error: 'Internal Server Error'
        })
      }
    }
  }
}
