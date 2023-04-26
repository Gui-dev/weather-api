import { type IForecastPoint, StormGlass } from '@src/clients/storm-glass'
import { ForecastProcessingInternalError } from '@src/errors/forecast-processing-internal-error'
import { type IBeach } from '@src/models/beaches-model'

export interface IBeachForecast extends Omit<IBeach, 'user'>, IForecastPoint { }
export interface ITimeForecast {
  time: string
  forecast: IBeachForecast[]
}

export class ForecastService {
  constructor(protected readonly stormGlass = new StormGlass()) { }

  public async processForecastForBeaches (beaches: IBeach[]): Promise<ITimeForecast[]> {
    const pointsWithCorrectSources: IBeachForecast[] = []
    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.latitude, beach.longitude)
        const enrichedBeachData = this.enrichedBeachData(points, beach)
        pointsWithCorrectSources.push(...enrichedBeachData)
      }
      return this.mapForecastByTime(pointsWithCorrectSources)
    } catch (err) {
      const error = err as Error
      throw new ForecastProcessingInternalError(error.message)
    }
  }

  private enrichedBeachData (points: IForecastPoint[], beach: IBeach): IBeachForecast[] {
    return points.map(point => {
      return {
        name: beach.name,
        position: beach.position,
        latitude: beach.latitude,
        longitude: beach.longitude,
        rating: 1,
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
