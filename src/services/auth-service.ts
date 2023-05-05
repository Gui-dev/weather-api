import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { type User } from '@src/models/user-model'

export interface IDecodedUser extends Omit<typeof User, '_id'> {
  id: string
}
dotenv.config()

export class AuthService {
  public static async hashPassword (password: string, salt = 10): Promise<string> {
    const passwordHash = await bcrypt.hash(password, salt)
    return passwordHash
  }

  public static async comparePassword (password: string, passwordHashed: string): Promise<boolean> {
    const isValidPassword = await bcrypt.compare(password, passwordHashed)
    return isValidPassword
  }

  public static generateToken (payload: Record<string, string>): string {
    const token = jwt.sign(payload, process.env.AUTH_SECRET_WORD as string, {
      expiresIn: process.env.AUTH_EXPIRES_IN as string
    })
    return token
  }

  public static decodeToken (token: string): IDecodedUser {
    const secret: string = process.env.AUTH_SECRET_WORD as string
    return jwt.verify(token, secret) as IDecodedUser
  }
}
