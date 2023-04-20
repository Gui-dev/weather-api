import { StormGlass } from '@src/clients/storm-glass'
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass-normalized-3-hours.json'
import { BeachPosition, ForecastService, type IBeach } from '../forecast-service'

jest.mock('@src/clients/storm-glass')

describe('#Forecast Service', () => {
  it('should the forecast a list of beaches', async () => {
    StormGlass.prototype.fetchPoints = jest.fn().mockResolvedValue(stormGlassNormalizedResponseFixture)
    const beaches: IBeach[] = [
      {
        name: 'Manly',
        position: BeachPosition.E,
        latitude: -33.792726,
        longitude: 151.289824,
        user: 'fake_id'
      }
    ]
    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [{
          latitude: -33.792726,
          longitude: 151.289824,
          name: 'Manly',
          position: 'E',
          rating: 1,
          swellDirection: 64.26,
          swellHeight: 0.15,
          swellPeriod: 3.89,
          time: '2020-04-26T00:00:00+00:00',
          waveDirection: 231.38,
          waveHeight: 0.47,
          windDirection: 299.45,
          windSpeed: 100
        }]
      },
      {
        time: '2020-04-26T01:00:00+00:00',
        forecast: [{
          latitude: -33.792726,
          longitude: 151.289824,
          name: 'Manly',
          position: 'E',
          rating: 1,
          swellDirection: 123.41,
          swellHeight: 0.21,
          swellPeriod: 3.67,
          time: '2020-04-26T01:00:00+00:00',
          waveDirection: 232.12,
          waveHeight: 0.46,
          windDirection: 310.48,
          windSpeed: 100
        }]
      },
      {
        time: '2020-04-26T02:00:00+00:00',
        forecast: [{
          latitude: -33.792726,
          longitude: 151.289824,
          name: 'Manly',
          position: 'E',
          rating: 1,
          swellDirection: 182.56,
          swellHeight: 0.28,
          swellPeriod: 3.44,
          time: '2020-04-26T02:00:00+00:00',
          waveDirection: 232.86,
          waveHeight: 0.46,
          windDirection: 321.5,
          windSpeed: 100
        }]
      }
    ]
    const forecast = new ForecastService(new StormGlass())
    const beachesWithRating = await forecast.processForecastForBeaches(beaches)

    expect(beachesWithRating).toEqual(expectedResponse)
  })
})
