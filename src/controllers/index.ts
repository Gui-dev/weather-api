import { type Response } from 'express'
import mongoose from 'mongoose'

import { CUSTOM_VALIDATION } from '@src/models/user-model'
import logger from '@src/config/logger'
import { APIError, type IAPIError } from '@src/errors/api-errors'

interface IHandleClientErrorsResponse {
  code: number
  error: string
}

export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse (
    response: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientError = this.handleClientErrors(error)
      response.status(clientError.code).send(APIError.format({
        code: clientError.code,
        message: clientError.error
      }))
    } else {
      logger.error(error)
      response.status(500).send(APIError.format({
        code: 500,
        message: 'Something went wrong'
      }))
    }
  }

  protected sendErrorResponse (response: Response, apiError: IAPIError): Response {
    return response.status(apiError.code).send(APIError.format(apiError))
  }

  private handleClientErrors (error: mongoose.Error.ValidationError): IHandleClientErrorsResponse {
    const duplicatedKindError = Object.values(error.errors).filter(
      err => err.kind === CUSTOM_VALIDATION.DUPLICATED
    )
    if (duplicatedKindError.length) {
      return {
        code: 409,
        error: error.message
      }
    } else {
      return {
        code: 422,
        error: error.message
      }
    }
  }
}
