import pino from 'pino'

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
