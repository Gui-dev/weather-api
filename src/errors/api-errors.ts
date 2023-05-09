import httpStatusCodes from 'http-status-codes'

export interface IAPIError {
  code: number
  codeAsString?: string
  message: string
  description?: string
  documentation?: string
}

export interface IAPIErrorResponse extends Omit<IAPIError, 'codeAsString'> {
  error: string
}

export class APIError {
  public static format (error: IAPIError): IAPIErrorResponse {
    return {
      ...{
        code: error.code,
        message: error.message,
        error: error.codeAsString
          ? error.codeAsString
          : httpStatusCodes.getStatusText(error.code)
      },
      ...(error.description && { description: error.description }),
      ...(error.documentation && { documentation: error.documentation })
    }
  }
}
