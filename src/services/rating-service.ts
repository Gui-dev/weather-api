import { type IBeach, BeachPosition } from '@src/models/beaches-model'

export class RatingService {
  constructor(private readonly beach: IBeach) { }

  public async getRatingBasedOnWindAndWavePosition (wavePosition: BeachPosition, windPosition: BeachPosition): Promise<number> {
    if (wavePosition === windPosition) {
      return 1
    } else if (this.isWindOffShore(wavePosition, windPosition)) {
      return 5
    }

    return 3
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
