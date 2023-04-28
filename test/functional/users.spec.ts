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

    it('should return 422 when then is a validation error', async () => {
      const newUser = {
        email: 'bruce@email.com',
        password: '123456'
      }
      const response = await global.testRequest.post('/users').send(newUser)

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.'
      })
    })
  })
})
