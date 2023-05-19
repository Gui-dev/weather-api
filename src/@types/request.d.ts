/* eslint-disable @typescript-eslint/naming-convention */
import type * as http from 'http'

declare module 'express-serve-static-core' {
  export interface Request extends http.IncomingMessage, Express.Request {
    decoded?: {
      userId?: string
    }
  }
}
