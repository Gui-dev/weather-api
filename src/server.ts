import * as dotenv from 'dotenv'
import { Server } from '@overnightjs/core'
import express, { type Application } from 'express'

import * as database from './shared/database/database'
import { ForecastController } from './controllers/forecast'
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

  private async databaseSetup (): Promise<void> {
    await database.connect()
  }

  private setupExpress (): void {
    this.app.use(express.json())
  }

  private setupControllers (): void {
    const forecastController = new ForecastController()
    this.addControllers([forecastController])
  }
}
