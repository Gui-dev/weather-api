import { type Document, type Model, Schema, model, models } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser {
  _id?: string
  name: string
  email: string
  password: string
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED'
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

schema.path('email').validate(async (email: string) => {
  const emailCount = await models.User.countDocuments({ email })
  return !emailCount
}, 'already exists in the database', CUSTOM_VALIDATION.DUPLICATED)

export const hashPassword = async (password: string, salt = 10): Promise<string> => {
  const passwordHash = await bcrypt.hash(password, salt)
  return passwordHash
}

export const comparePassword = async (password: string, passwordHashed: string): Promise<boolean> => {
  const isValidPassword = await bcrypt.compare(password, passwordHashed)
  return isValidPassword
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const User: Model<IUserModel> = model('User', schema)
