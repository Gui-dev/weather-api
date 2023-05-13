import { type IForecastPoint } from '@src/clients/storm-glass'
import { type IBeach, GeoPosition } from '@src/models/beaches-model'

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

  public getRateForPoint (point: IForecastPoint): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection)
    const windDirection = this.getPositionFromLocation(point.windDirection)
    const windAndWaverating = this.getRatingBasedOnWindAndWavePosition(
      swellDirection,
      windDirection
    )
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight)
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod)
    const finalRating = Math.round((windAndWaverating + swellHeightRating + swellPeriodRating) / 3)
    return finalRating
  }

  public getRatingBasedOnWindAndWavePosition (wavePosition: GeoPosition, windPosition: GeoPosition): number {
    if (wavePosition === windPosition) {
      return 1
    } else if (this.isWindOffShore(wavePosition, windPosition)) {
      return 5
    }

    return 3
  }

  public getRatingForSwellPeriod (period: number): number {
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

  public getRatingForSwellSize (height: number): number {
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

  public getPositionFromLocation (coordinates: number): GeoPosition {
    if (coordinates >= 310 || (coordinates < 50 && coordinates >= 0)) {
      return GeoPosition.N
    }
    if (coordinates >= 50 && coordinates < 120) {
      return GeoPosition.E
    }
    if (coordinates >= 120 && coordinates < 220) {
      return GeoPosition.S
    }
    if (coordinates >= 220 && coordinates < 310) {
      return GeoPosition.W
    }

    return GeoPosition.E
  }

  private isWindOffShore (wavePosition: GeoPosition, windPosition: GeoPosition): boolean {
    return (
      (
        wavePosition === GeoPosition.N &&
        windPosition === GeoPosition.S &&
        this.beach.position === GeoPosition.N
      ) ||
      (
        wavePosition === GeoPosition.S &&
        windPosition === GeoPosition.N &&
        this.beach.position === GeoPosition.S
      ) ||
      (
        wavePosition === GeoPosition.E &&
        windPosition === GeoPosition.W &&
        this.beach.position === GeoPosition.E
      ) ||
      (
        wavePosition === GeoPosition.W &&
        windPosition === GeoPosition.E &&
        this.beach.position === GeoPosition.W
      )
    )
  }
}
