import config from 'config'

import { SetupServer } from './server'

const bootstrap = async (): Promise<void> => {
  const server = new SetupServer(config.get('App.port'))
  await server.init()
  server.start()
}

bootstrap()
  .catch(error => {
    console.log(error)
  })