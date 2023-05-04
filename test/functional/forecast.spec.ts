/* eslint-disable @typescript-eslint/no-unused-vars */
import nock from 'nock'

import { Beach, BeachPosition } from '@src/models/beaches-model'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass-weather-3-hours.json'
import apiForecastResponse1BeachFixture from '@test/fixtures/api-forecast-response-1-beach.json'
import { User } from '@src/models/user-model'
import { AuthService } from '@src/services/auth-service'

describe('#Beach forecast fuctional tests', () => {
  const fakeUser = {
    name: 'Bruce Wayne',
    email: 'bruce@email.com',
    password: '123456'
  }
  let token = ''
  beforeEach(async () => {
    await Beach.deleteMany({})
    await User.deleteMany({})
    const user = await new User(fakeUser).save()
    token = AuthService.generateToken(user.toJSON())

    const defaultBeach = {
      name: 'Manly',
      position: BeachPosition.E,
      latitude: -33.792726,
      longitude: 151.289824,
      user: user.id
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
    const { body, status } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token })

    expect(status).toBe(200)
    expect(body).toEqual(apiForecastResponse1BeachFixture)
  })

  it('should return code 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true
      }
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824'
      })
      .replyWithError('Something went wrong')
    const { status } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token })

    expect(status).toBe(500)
  })
})
