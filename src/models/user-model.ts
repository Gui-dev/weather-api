import { type Document, type Model, Schema, model, models } from 'mongoose'

import { AuthService } from '@src/services/auth-service'

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

schema.pre('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return
  }
  const hashedPassword = await AuthService.hashPassword(this.password)
  this.password = hashedPassword
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const User: Model<IUserModel> = model('User', schema)
