import * as dotenv from 'dotenv'
import { Server } from '@overnightjs/core'
import express, { type Application } from 'express'
import expressPino from 'express-pino-logger'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import * as OpenApiValidator from 'express-openapi-validator'
import { type OpenAPIV3 } from 'express-openapi-validator/dist/framework/types'

import apiSchema from './api.schema.json'
import * as database from './shared/database/database'
import { ForecastController } from './controllers/forecast'
import { BeachesController } from './controllers/beaches'
import { UsersController } from './controllers/users'
import logger from './config/logger'
dotenv.config()

export class SetupServer extends Server {
  constructor(private readonly port = 3333 || process.env.PORT) {
    super()
  }

  public async init (): Promise<void> {
    this.setupExpress()
    await this.docSetup()
    this.setupControllers()
    await this.databaseSetup()
  }

  public getApp (): Application {
    return this.app
  }

  public async close (): Promise<void> {
    await database.close()
  }

  public start (): void {
    this.app.listen(this.port, () => {
      logger.info(`Server listening on port: ${this.port}`)
    })
  }

  private async docSetup (): Promise<void> {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema))
    this.app.use(OpenApiValidator.middleware({
      apiSpec: apiSchema as OpenAPIV3.Document,
      validateRequests: false,
      validateResponses: false
    }))
  }

  private async databaseSetup (): Promise<void> {
    await database.connect()
  }

  private setupExpress (): void {
    this.app.use(express.json())
    this.app.use(cors())
    this.app.use(expressPino({ logger }))
  }

  private setupControllers (): void {
    const forecastController = new ForecastController()
    const beachesController = new BeachesController()
    const usersController = new UsersController()
    this.addControllers([forecastController, beachesController, usersController])
  }
}
