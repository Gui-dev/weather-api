import mongoose, { type Mongoose } from 'mongoose'

export const connect = async (): Promise<Mongoose> => {
  return await mongoose.connect(process.env.DATABASE_URL as string)
}

export const close = async (): Promise<void> => {
  await mongoose.connection.close()
}
