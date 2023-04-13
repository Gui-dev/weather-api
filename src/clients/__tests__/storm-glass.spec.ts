import axios from 'axios'

import { StormGlass } from '@src/clients/storm-glass'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass-weather-3-hours.json'
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass-normalized-3-hours.json'

jest.mock('axios')

describe('#StormGlass client', () => {
  it('should return the normalized forecast from the StormGlass service', async () => {
    const latitude = 58.7984
    const longitude = 17.8081
    axios.get = jest.fn().mockResolvedValue({ data: stormGlassWeather3HoursFixture })
    const stormGlass = new StormGlass(axios)
    const response = await stormGlass.fetchPoints(latitude, longitude)

    expect(response).toEqual(stormGlassNormalized3HoursFixture)
  })
})
