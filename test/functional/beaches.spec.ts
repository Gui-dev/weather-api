import { Beach } from '@src/models/beaches-model'

describe('#Beaches functional tests', () => {
  beforeAll(async () => await Beach.deleteMany({}))

  describe('#When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        name: 'Manly',
        position: 'E',
        latitude: -33.792726,
        longitude: 151.289824
      }
      const response = await global.testRequest.post('/beaches').send(newBeach)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(expect.objectContaining(newBeach))
    })

    it('should return 422 when there is a validation error', async () => {
      const newBeach = {
        name: 'Manly',
        position: 'E',
        latitude: 'invalid_latitude',
        longitude: 151.289824
      }
      const response = await global.testRequest.post('/beaches').send(newBeach)

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        error: 'Beach validation failed: latitude: Cast to Number failed for value "invalid_latitude" (type string) at path "latitude"'
      })
    })
  })
})
