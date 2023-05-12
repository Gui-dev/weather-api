import { type IForecastPoint } from '@src/clients/storm-glass'
import { type IBeach, BeachPosition } from '@src/models/beaches-model'

export class RatingService {
  private readonly waveHeights = {
    ankleToKnee: {
      min: 0.3,
      max: 1.0
    },
    waistHigh: {
      min: 1.0,
      max: 2.0
    },
    headHigh: {
      min: 2.0,
      max: 2.5
    }
  }

  constructor(private readonly beach: IBeach) { }

  public async getRateForPoint (point: IForecastPoint): Promise<number> {
    const swellDirection = await this.getPositionFromLocation(point.swellDirection)
    const windDirection = await this.getPositionFromLocation(point.windDirection)
    const windAndWaverating = await this.getRatingBasedOnWindAndWavePosition(
      swellDirection,
      windDirection
    )
    const swellHeightRating = await this.getRatingForSwellSize(point.swellHeight)
    const swellPeriodRating = await this.getRatingForSwellPeriod(point.swellPeriod)
    const finalRating = Math.round((windAndWaverating + swellHeightRating + swellPeriodRating) / 3)
    return finalRating
  }

  public async getRatingBasedOnWindAndWavePosition (wavePosition: BeachPosition, windPosition: BeachPosition): Promise<number> {
    if (wavePosition === windPosition) {
      return 1
    } else if (this.isWindOffShore(wavePosition, windPosition)) {
      return 5
    }

    return 3
  }

  public async getRatingForSwellPeriod (period: number): Promise<number> {
    if (period >= 7 && period < 10) {
      return 2
    }
    if (period >= 10 && period < 14) {
      return 4
    }
    if (period >= 14) {
      return 5
    }
    return 1
  }

  public async getRatingForSwellSize (height: number): Promise<number> {
    if (height >= this.waveHeights.ankleToKnee.min && height < this.waveHeights.ankleToKnee.max) {
      return 2
    }
    if (height >= this.waveHeights.waistHigh.min && height < this.waveHeights.waistHigh.max) {
      return 3
    }
    if (height >= this.waveHeights.headHigh.min) {
      return 5
    }

    return 1
  }

  public async getPositionFromLocation (coordinates: number): Promise<BeachPosition> {
    if (coordinates >= 310 || (coordinates < 50 && coordinates >= 0)) {
      return BeachPosition.N
    }
    if (coordinates >= 50 && coordinates < 120) {
      return BeachPosition.E
    }
    if (coordinates >= 120 && coordinates < 220) {
      return BeachPosition.S
    }
    if (coordinates >= 220 && coordinates < 310) {
      return BeachPosition.W
    }

    return BeachPosition.E
  }

  private isWindOffShore (wavePosition: BeachPosition, windPosition: BeachPosition): boolean {
    return (
      (
        wavePosition === BeachPosition.N &&
        windPosition === BeachPosition.S &&
        this.beach.position === BeachPosition.N
      ) ||
      (
        wavePosition === BeachPosition.S &&
        windPosition === BeachPosition.N &&
        this.beach.position === BeachPosition.S
      ) ||
      (
        wavePosition === BeachPosition.E &&
        windPosition === BeachPosition.W &&
        this.beach.position === BeachPosition.E
      ) ||
      (
        wavePosition === BeachPosition.W &&
        windPosition === BeachPosition.E &&
        this.beach.position === BeachPosition.W
      )
    )
  }
}
