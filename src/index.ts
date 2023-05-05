import { SetupServer } from './server'

const bootstrap = async (): Promise<void> => {
  const server = new SetupServer()
  await server.init()
  server.start()
}

bootstrap()
  .catch(error => {
    console.log(error)
  })
