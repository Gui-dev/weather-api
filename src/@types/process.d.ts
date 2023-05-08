/* eslint-disable @typescript-eslint/naming-convention */
declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number
    DATABASE_URL: string
    AUTH_SECRET_WORD: string
    AUTH_EXPIRES_IN: string
    STORMGLASS_API_URL: string
    STORMGLASS_API_TOKEN: string
    ENABLED: boolean
    LEVEL: string
  }
}
