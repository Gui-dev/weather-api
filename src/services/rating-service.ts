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
