import { type IForecastPoint, StormGlass } from '@src/clients/storm-glass'

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}
export interface IBeach {
  name: string
  position: BeachPosition
  latitude: number
  longitude: number
  user: string
}
export interface IBeachForecast extends Omit<IBeach, 'user'>, IForecastPoint { }
export interface ITimeForecast {
  time: string
  forecast: IBeachForecast[]
}

export class ForecastService {
  constructor(protected readonly stormGlass = new StormGlass()) { }

  public async processForecastForBeaches (beaches: IBeach[]): Promise<ITimeForecast[]> {
    const pointsWithCorrectSources: IBeachForecast[] = []
    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.latitude, beach.longitude)
      const enrichedBeachData = points.map(point => {
        return {
          name: beach.name,
          position: beach.position,
          latitude: beach.latitude,
          longitude: beach.longitude,
          rating: 1,
          ...point
        }
      })
      pointsWithCorrectSources.push(...enrichedBeachData)
    }
    return this.mapForecastByTime(pointsWithCorrectSources)
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
