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
    const fakePoint = {
      swellDirection: 110,
      swellHeight: 0.1,
      swellPeriod: 5,
      time: 'test',
      waveDirection: 110,
      waveHeight: 0.1,
      windDirection: 100,
      windSpeed: 100
    }
    it('should get a rating less than 1 for a poor point', async () => {
      const rating = await fakeRating.getRateForPoint(fakePoint)
      expect(rating).toBe(1)
    })

    it('should get a rating of 1 for an OK point', async () => {
      const pointData = { swellHeight: 0.4 }
      const point = Object.assign(fakePoint, pointData)
      const rating = await fakeRating.getRateForPoint(point)
      expect(rating).toBe(1)
    })

    it('should get a rating of 3 for a point with offshare winds and a half overhead height', async () => {
      const pointData = { swellHeight: 0.7, windDirection: 250 }
      const point = Object.assign(fakePoint, pointData)
      const rating = await fakeRating.getRateForPoint(point)
      expect(rating).toBe(3)
    })
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

  describe('#Get rating based on swell height', () => {
    it('should get rating 1 for less than ankle to knee high swell', async () => {
      const rating = await fakeRating.getRatingForSwellSize(0.2)
      expect(rating).toBe(1)
    })

    it('should get rating 2 for an ankle to knee swell', async () => {
      const rating = await fakeRating.getRatingForSwellSize(0.6)
      expect(rating).toBe(2)
    })

    it('should get rating 3 for waist high swell', async () => {
      const rating = await fakeRating.getRatingForSwellSize(1.5)
      expect(rating).toBe(3)
    })

    it('should get rating 5 for overhead swell', async () => {
      const rating = await fakeRating.getRatingForSwellSize(2.5)
      expect(rating).toBe(5)
    })
  })

  describe('#Get position based on points location', () => {
    it('should get the ponit based on east location', async () => {
      const response = await fakeRating.getPositionFromLocation(92)
      expect(response).toBe(BeachPosition.E)
    })

    it('should get the ponit based on a north location 1', async () => {
      const response = await fakeRating.getPositionFromLocation(360)
      expect(response).toBe(BeachPosition.N)
    })

    it('should get the ponit based on a north location 2', async () => {
      const response = await fakeRating.getPositionFromLocation(40)
      expect(response).toBe(BeachPosition.N)
    })

    it('should get the ponit based on a south location', async () => {
      const response = await fakeRating.getPositionFromLocation(200)
      expect(response).toBe(BeachPosition.S)
    })

    it('should get the ponit based on a west location', async () => {
      const response = await fakeRating.getPositionFromLocation(300)
      expect(response).toBe(BeachPosition.W)
    })
  })
})
