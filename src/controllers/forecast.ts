import { ClassMiddleware, Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'

import { ForecastService } from '@src/services/forecast-service'
import { Beach } from '@src/models/beaches-model'
import { authMiddleware } from '@src/middlewares/auth'
import logger from '@src/config/logger'

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController {
  @Get('')
  public async getForecastForLoggedUser (request: Request, response: Response): Promise<Response> {
    try {
      const forecast = new ForecastService()
      const beaches = await Beach.find({
        user: request.decoded?.id
      })
      const forecastData = await forecast.processForecastForBeaches(beaches)

      return response.status(200).send(forecastData)
    } catch (error) {
      logger.error(error)
      return response.status(500).send({ error: 'Something went wrong' })
    }
  }
}
