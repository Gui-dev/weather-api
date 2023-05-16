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
})
