import pino from 'pino'
import dotenv from 'dotenv'

dotenv.config()

export default pino({
  enabled: process.env.LOGGER_ENABLED,
  level: process.env.LOGGER_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})
