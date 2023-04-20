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

export class ForecastService {
  constructor(protected readonly stormGlass = new StormGlass()) { }

  public async processForecastForBeaches (beaches: IBeach[]): Promise<IBeachForecast[]> {
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
    return pointsWithCorrectSources
  }
}
