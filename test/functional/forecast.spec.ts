import nock from 'nock'

import { Beach } from '@src/models/beaches-model'
import { BeachPosition } from '@src/services/forecast-service'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass-weather-3-hours.json'
import apiForecastResponse1BeachFixture from '@test/fixtures/api-forecast-response-1-beach.json'

describe('#Beach forecast fuctional tests', () => {
  beforeEach(async () => {
    await Beach.deleteMany({})
    const defaultBeach = {
      name: 'Manly',
      position: BeachPosition.E,
      latitude: -33.792726,
      longitude: 151.289824
    }
    const beach = new Beach(defaultBeach)
    await beach.save()
  })

  it('should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true
      }
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        params: /(.*)/,
        source: 'noaa',
        lat: '-33.792726',
        lng: '151.289824'
      })
      .reply(200, stormGlassWeather3HoursFixture)
    const { body, status } = await global.testRequest.get('/forecast')

    expect(status).toBe(200)
    expect(body).toEqual(apiForecastResponse1BeachFixture)
  })
})
