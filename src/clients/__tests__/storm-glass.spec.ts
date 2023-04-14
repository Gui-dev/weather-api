import axios from 'axios'

import { StormGlass } from '@src/clients/storm-glass'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass-weather-3-hours.json'
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass-normalized-3-hours.json'

jest.mock('axios')

describe('#StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  it('should return the normalized forecast from the StormGlass service', async () => {
    const latitude = 58.7984
    const longitude = 17.8081
    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture })
    const stormGlass = new StormGlass(mockedAxios)
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
    mockedAxios.get.mockResolvedValue({ data: incompleteResponse })
    const stormGlass = new StormGlass(mockedAxios)
    const response = await stormGlass.fetchPoints(latitude, longitude)

    expect(response).toEqual([])
  })

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const latitude = 58.7984
    const longitude = 17.8081
    mockedAxios.get.mockRejectedValue({ message: 'Network Error' })
    const stormGlass = new StormGlass(mockedAxios)

    await expect(stormGlass.fetchPoints(latitude, longitude)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    )
  })
})
