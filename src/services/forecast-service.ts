import _ from 'lodash'

import { type IForecastPoint, StormGlass } from '@src/clients/storm-glass'
import { ForecastProcessingInternalError } from '@src/errors/forecast-processing-internal-error'
import { type IBeach } from '@src/models/beaches-model'
import logger from '@src/config/logger'
import { RatingService } from './rating-service'

export interface IBeachForecast extends Omit<IBeach, 'id' | 'userId'>, IForecastPoint { }
export interface ITimeForecast {
  time: string
  forecast: IBeachForecast[]
}

export class ForecastService {
  constructor(
    protected readonly stormGlass = new StormGlass(),
    protected Rating: typeof RatingService = RatingService
  ) { }

  public async processForecastForBeaches (beaches: IBeach[]): Promise<ITimeForecast[]> {
    try {
      const beachForecast = await this.calculateRating(beaches)
      const timeForecast = this.mapForecastByTime(beachForecast)
      return timeForecast.map(time_forecast => {
        return {
          time: time_forecast.time,
          forecast: _.orderBy(time_forecast.forecast, ['rating'], ['desc'])
        }
      })
    } catch (err) {
      const error = err as Error
      logger.error(error)
      throw new ForecastProcessingInternalError(error.message)
    }
  }

  private async calculateRating (beaches: IBeach[]): Promise<IBeachForecast[]> {
    const pointsWithCorrectSources: IBeachForecast[] = []
    logger.info(`Preparing the forecast for ${beaches.length} beaches`)
    for (const beach of beaches) {
      const rating = new this.Rating(beach)
      const points = await this.stormGlass.fetchPoints(beach.latitude, beach.longitude)
      const enrichedBeachData = this.enrichedBeachData(points, beach, rating)
      pointsWithCorrectSources.push(...enrichedBeachData)
    }
    return pointsWithCorrectSources
  }

  private enrichedBeachData (points: IForecastPoint[], beach: IBeach, rating: RatingService): IBeachForecast[] {
    return points.map(point => {
      return {
        name: beach.name,
        position: beach.position,
        latitude: beach.latitude,
        longitude: beach.longitude,
        rating: rating.getRateForPoint(point),
        ...point
      }
    })
  }

  private mapForecastByTime (forecast: IBeachForecast[]): ITimeForecast[] {
    const forecastByTime: ITimeForecast[] = []
    for (const point of forecast) {
      const timePoint = forecastByTime.find(forecastResult => forecastResult.time === point.time)

      if (timePoint) {
        timePoint.forecast.push(point)
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point]
        })
      }
    }

    return forecastByTime
  }
}
