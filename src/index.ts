/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-misused-promises */
import logger from './config/logger'
import { SetupServer } from './server'

enum ExitStatus {
  Failure = 1,
  Success = 0
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`
  )
  throw reason
})

process.on('uncaughtException', error => {
  logger.error(`App exiting due to an uncaught exception: ${error}`)
  process.exit(ExitStatus.Failure)
})

const bootstrap = async (): Promise<void> => {
  const server = new SetupServer()
  await server.init()
  server.start()
  const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT']
  exitSignals.map(sig => process.on(sig, async () => {
    try {
      await server.close()
      logger.info('App exited with success')
      process.exit(ExitStatus.Success)
    } catch (error) {
      logger.error(`App exited with error ${error}`)
      process.exit(ExitStatus.Failure)
    }
  }))
}

bootstrap()
  .catch(error => {
    logger.error(`App exited with error ${error}`)
    process.exit(ExitStatus.Failure)
  })
