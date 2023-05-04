/* eslint-disable @typescript-eslint/no-unused-vars */
import { Beach } from '@src/models/beaches-model'
import { User } from '@src/models/user-model'
import { AuthService } from '@src/services/auth-service'

describe('#Beaches functional tests', () => {
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
  })

  describe('#When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        name: 'Manly',
        position: 'E',
        latitude: -33.792726,
        longitude: 151.289824
      }
      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach)

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
      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach)

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        error: 'Beach validation failed: latitude: Cast to Number failed for value "invalid_latitude" (type string) at path "latitude"'
      })
    })
  })
})
