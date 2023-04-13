/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type AxiosStatic } from 'axios'

type IStormGlassPointSource = Record<string, number>

interface IStormGlassPoint {
  readonly time: string
  readonly waveDirection: IStormGlassPointSource
  readonly waveHeight: IStormGlassPointSource
  readonly swellDirection: IStormGlassPointSource
  readonly swellHeight: IStormGlassPointSource
  readonly swellPeriod: IStormGlassPointSource
  readonly windDirection: IStormGlassPointSource
  readonly windSpeed: IStormGlassPointSource
}

export interface IStormGlassForecastResponse {
  hours: IStormGlassPoint[]
}

export interface IForecastPoint {
  time: string
  waveDirection: number
  waveHeight: number
  swellDirection: number
  swellHeight: number
  swellPeriod: number
  windDirection: number
  windSpeed: number
}

export class StormGlass {
  private readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed'
  private readonly stormGlassAPISource = 'noaa'

  constructor(protected request: AxiosStatic) { }

  public async fetchPoints (latitude: number, longitude: number): Promise<IForecastPoint[]> {
    const response = await this.request.get<IStormGlassForecastResponse>(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${latitude}&lng=${longitude}`,
      {
        headers: {
          Authorization: process.env.STORM_GLASS_KEY
        }
      }
    )
    return this.normalizedResponse(response.data)
  }

  private normalizedResponse (points: IStormGlassForecastResponse): IForecastPoint[] {
    return points.hours
      .filter(point => this.isValidPoint(point))
      .map(point => {
        return {
          time: point.time,
          swellDirection: point.swellDirection?.[this.stormGlassAPISource],
          swellHeight: point.swellHeight?.[this.stormGlassAPISource],
          swellPeriod: point.swellPeriod?.[this.stormGlassAPISource],
          waveDirection: point.waveDirection?.[this.stormGlassAPISource],
          waveHeight: point.waveHeight?.[this.stormGlassAPISource],
          windDirection: point.windDirection?.[this.stormGlassAPISource],
          windSpeed: point.windSpeed?.[this.stormGlassAPISource]
        }
      })
  }

  private isValidPoint (point: Partial<IStormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    )
  }
}
