import { ClassMiddleware, Controller, Get, Middleware } from '@overnightjs/core'
import { Request, Response } from 'express'

import { ForecastService } from '@src/services/forecast-service'
import { Beach } from '@src/models/beaches-model'
import { authMiddleware } from '@src/middlewares/auth'
import { BaseController } from '.'
import { rateLimiter } from '@src/middlewares/rateLimiter'

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  @Middleware(rateLimiter)
  public async getForecastForLoggedUser (request: Request, response: Response): Promise<void> {
    try {
      const forecast = new ForecastService()
      const beaches = await Beach.find({
        user: request.decoded?.id
      })
      const forecastData = await forecast.processForecastForBeaches(beaches)
      response.status(200).send(forecastData)
    } catch (err) {
      this.sendErrorResponse(response, { code: 500, message: 'Something went wrong' })
    }
  }
}
