import { StormGlass } from '@src/clients/storm-glass'
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass-normalized-3-hours.json'
import { ForecastService } from '../forecast-service'
import { ForecastProcessingInternalError } from '@src/errors/forecast-processing-internal-error'
import { GeoPosition, type IBeach } from '@src/models/beaches-model'

jest.mock('@src/clients/storm-glass')

describe('#Forecast Service', () => {
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>

  it('should return the forecast for multiple beaches in the same hour with different ratings ordered by rating', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 123.41,
        swellHeight: 0.21,
        swellPeriod: 3.67,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 232.12,
        waveHeight: 0.46,
        windDirection: 310.48,
        windSpeed: 100
      }
    ])
    mockedStormGlassService.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 64.26,
        swellHeight: 0.15,
        swellPeriod: 13.89,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 231.38,
        waveHeight: 2.07,
        windDirection: 299.45,
        windSpeed: 100
      }
    ])
    const beaches: IBeach[] = [
      {
        latitude: -33.792726,
        longitude: 151.289824,
        name: 'Manly',
        position: GeoPosition.E,
        userId: 'fake-user-id'
      },
      {
        latitude: -33.792726,
        longitude: 141.289824,
        name: 'Dee Why',
        position: GeoPosition.S,
        userId: 'fake-user-id'
      }
    ]
    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            latitude: -33.792726,
            longitude: 141.289824,
            name: 'Dee Why',
            position: 'S',
            rating: 3,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 13.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 2.07,
            windDirection: 299.45,
            windSpeed: 100
          },
          {
            latitude: -33.792726,
            longitude: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100
          }
        ]
      }
    ]

    const forecast = new ForecastService(mockedStormGlassService)
    const beachesWithRating = await forecast.processForecastForBeaches(beaches)
    expect(beachesWithRating).toEqual(expectedResponse)
  })

  it('should return the forecast a list of beaches', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(stormGlassNormalizedResponseFixture)
    const beaches: IBeach[] = [
      {
        name: 'Manly',
        position: GeoPosition.E,
        latitude: -33.792726,
        longitude: 151.289824,
        userId: 'fake_user_id'
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
          rating: 2,
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
          rating: 2,
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
          rating: 2,
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
    const forecast = new ForecastService(mockedStormGlassService)
    const beachesWithRating = await forecast.processForecastForBeaches(beaches)

    expect(beachesWithRating).toEqual(expectedResponse)
  })

  it('should return an empty list when the beaches array is empty', async () => {
    const forecast = new ForecastService()
    const response = await forecast.processForecastForBeaches([])

    expect(response).toEqual([])
  })

  it('should throw internal processing error when something goes wrong during the rating process', async () => {
    const beaches: IBeach[] = [
      {
        name: 'Manly',
        position: GeoPosition.E,
        latitude: -33.792726,
        longitude: 151.289824,
        userId: 'fake_user_id'
      }
    ]
    mockedStormGlassService.fetchPoints.mockRejectedValue({ message: 'Error fetching data' })
    const forecast = new ForecastService(mockedStormGlassService)

    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      ForecastProcessingInternalError
    )
  })
})
