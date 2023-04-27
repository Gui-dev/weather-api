import { User } from '@src/models/user-model'

describe('#Users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })
  describe('WHen creating a new user', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: '123456'
      }
      const response = await global.testRequest.post('/users').send(newUser)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(expect.objectContaining(newUser))
    })
  })
})
