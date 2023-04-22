import config, { type IConfig } from 'config'
import mongoose, { type Mongoose } from 'mongoose'

const dbConfig: IConfig = config.get('App.database')

export const connect = async (): Promise<Mongoose> => {
  return await mongoose.connect(dbConfig.get('mongoUrl'))
}

export const close = async (): Promise<void> => {
  await mongoose.connection.close()
}
