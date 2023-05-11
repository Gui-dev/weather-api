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

  describe('#Get rating based on swell period', () => {
    it('should get a rating of 1 for a period of 5 seconds', async () => {
      const rating = await fakeRating.getRatingForSwellPeriod(5)
      expect(rating).toBe(1)
    })

    it('should get a rating of 2 for a period of 9 seconds', async () => {
      const rating = await fakeRating.getRatingForSwellPeriod(9)
      expect(rating).toBe(2)
    })

    it('should get a rating of 4 for a period of 12 seconds', async () => {
      const rating = await fakeRating.getRatingForSwellPeriod(12)
      expect(rating).toBe(4)
    })

    it('should get a rating of 5 for a period of 16 seconds', async () => {
      const rating = await fakeRating.getRatingForSwellPeriod(16)
      expect(rating).toBe(5)
    })
  })
})
