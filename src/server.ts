import * as dotenv from 'dotenv'
import { Server } from '@overnightjs/core'
import express, { type Application } from 'express'

import * as database from './shared/database/database'
import { ForecastController } from './controllers/forecast'
import { BeachesController } from './controllers/beaches'
dotenv.config()

export class SetupServer extends Server {
  constructor(private readonly port = 3333 || process.env.PORT) {
    super()
  }

  public async init (): Promise<void> {
    this.setupExpress()
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
      console.info(`Server listening on port: ${this.port}`)
    })
  }

  private async databaseSetup (): Promise<void> {
    await database.connect()
  }

  private setupExpress (): void {
    this.app.use(express.json())
  }

  private setupControllers (): void {
    const forecastController = new ForecastController()
    const beachesController = new BeachesController()
    this.addControllers([forecastController, beachesController])
  }
}
