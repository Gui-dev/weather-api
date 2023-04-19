import * as HTTPUtil from '@src/util/request'
import { StormGlass } from '@src/clients/storm-glass'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass-weather-3-hours.json'
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass-normalized-3-hours.json'

jest.mock('@src/util/request')

describe('#StormGlass client', () => {
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>

  it('should return the normalized forecast from the StormGlass service', async () => {
    const latitude = 58.7984
    const longitude = 17.8081
    mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture } as HTTPUtil.IResponse)
    const stormGlass = new StormGlass(mockedRequest)
    const response = await stormGlass.fetchPoints(latitude, longitude)

    expect(response).toEqual(stormGlassNormalized3HoursFixture)
  })

  it('should exclude incomplete data points', async () => {
    const latitude = 58.7984
    const longitude = 17.8081
    const incompleteResponse = {
      hours: [
        {
          time: '2020-04-26T00:00:00+00:00',
          windDirection: {
            noaa: 300
          }
        }
      ]
    }
    mockedRequest.get.mockResolvedValue({ data: incompleteResponse } as HTTPUtil.IResponse)
    const stormGlass = new StormGlass(mockedRequest)
    const response = await stormGlass.fetchPoints(latitude, longitude)

    expect(response).toEqual([])
  })

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const latitude = 58.7984
    const longitude = 17.8081
    mockedRequest.get.mockRejectedValue({ message: 'Network Error' })
    const stormGlass = new StormGlass(mockedRequest)

    await expect(stormGlass.fetchPoints(latitude, longitude)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    )
  })

  it('should get a StormGlassResponseError when the StormGlass service responds with error', async () => {
    const latitude = 58.7984
    const longitude = 17.8081
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: {
          errors: ['Rate Limit reached']
        }
      }
    })
    const stormGlass = new StormGlass(mockedRequest)

    await expect(stormGlass.fetchPoints(latitude, longitude)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    )
  })
})
