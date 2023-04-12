import { Server } from '@overnightjs/core'
import express, { type Application } from 'express'

import { ForecastController } from './controllers/forecast'

export class SetupServer extends Server {
  constructor(private readonly port = 3333 || process.env.PORT) {
    super()
  }

  public init (): void {
    this.setupExpress()
    this.setupControllers()
  }

  public getApp (): Application {
    return this.app
  }

  private setupExpress (): void {
    this.app.use(express.json())
  }

  private setupControllers (): void {
    const forecastController = new ForecastController()
    this.addControllers([forecastController])
  }
}
