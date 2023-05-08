import pino from 'pino'

export default pino({
  enabled: process.env.ENABLED,
  level: process.env.LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})
