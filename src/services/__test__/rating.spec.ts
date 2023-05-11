import { BeachPosition, type IBeach } from '@src/models/beaches-model'
import { RatingService } from '../rating-service'

describe('#Rating Service', () => {
  const fakeBeach: IBeach = {
    name: '',
    position: BeachPosition.E,
    latitude: -33.792726,
    longitude: 151.289824,
    user: 'fake_user_id'
  }
  const fakeRating = new RatingService(fakeBeach)

  describe('#Calculate rating for a given point', () => {

  })

  describe('#Get rating based on wind and wave position', () => {
    it('should get rating 1 for a beach with onshore winds', async () => {
      const rating = await fakeRating.getRatingBasedOnWindAndWavePosition(
        BeachPosition.E,
        BeachPosition.E
      )

      expect(rating).toBe(1)
    })

    it('should get rating 3 for a beach with cross winds', async () => {
      const rating = await fakeRating.getRatingBasedOnWindAndWavePosition(
        BeachPosition.E,
        BeachPosition.S
      )

      expect(rating).toBe(3)
    })

    it('should get rating 5 for a beach with offshore winds', async () => {
      const rating = await fakeRating.getRatingBasedOnWindAndWavePosition(
        BeachPosition.E,
        BeachPosition.W
      )

      expect(rating).toBe(5)
    })
  })
})
