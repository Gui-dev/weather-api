import { APIError } from '../api-errors'

describe('#API Errors', () => {
  it('should format error with mandatory fields', () => {
    const error = APIError.format({
      code: 404,
      message: 'User not found'
    })

    expect(error).toEqual({
      code: 404,
      error: 'Not Found',
      message: 'User not found'
    })
  })

  it('should format error with mandatory fields and description', async () => {
    const error = APIError.format({
      code: 404,
      message: 'User not found',
      description: 'This error happens when there is no user created'
    })

    expect(error).toEqual({
      code: 404,
      error: 'Not Found',
      message: 'User not found',
      description: 'This error happens when there is no user created'
    })
  })

  it('should format error with mandatory fields and description and documentation', async () => {
    const error = APIError.format({
      code: 404,
      message: 'User not found',
      description: 'This error happens when there is no user created',
      documentation: 'https://mydocs.com/error-404'
    })

    expect(error).toEqual({
      code: 404,
      error: 'Not Found',
      message: 'User not found',
      description: 'This error happens when there is no user created',
      documentation: 'https://mydocs.com/error-404'
    })
  })
})
