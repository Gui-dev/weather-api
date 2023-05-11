import { type IBeach, type BeachPosition } from '@src/models/beaches-model'

export class RatingService {
  constructor(private readonly beach: IBeach) { }

  public async getRatingBasedOnWindAndWavePosition (wavePosition: BeachPosition, windPosition: BeachPosition): Promise<number> {
    if (wavePosition === windPosition) {
      return 1
    }

    return 0
  }
}
