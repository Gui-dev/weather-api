import { type Document, type Model, Schema, model } from 'mongoose'

export interface IUser {
  _id?: string
  name: string
  email: string
  password: string
}

interface IUserModel extends Omit<IUser, '_id'>, Document { }

const schema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true }
}, {
  toJSON: {
    transform: (_, ret): void => {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
    }
  }
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const User: Model<IUserModel> = model('User', schema)
