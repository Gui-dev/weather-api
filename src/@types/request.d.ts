/* eslint-disable @typescript-eslint/naming-convention */

import { type IDecodedUser } from '@src/services/auth-service'

declare module 'express-serve-static-core' {
  interface Request {
    decoded?: IDecodedUser
  }
}
