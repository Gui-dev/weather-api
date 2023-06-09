import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

export interface IJwtToken {
  sub: string
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

  public static generateToken (sub: string): string {
    const secret = process.env.AUTH_SECRET_WORD
    const expiresIn = process.env.AUTH_EXPIRES_IN
    const token = jwt.sign({ sub }, secret, {
      expiresIn
    })
    return token
  }

  public static decodeToken (token: string): IJwtToken {
    const secret: string = process.env.AUTH_SECRET_WORD
    return jwt.verify(token, secret) as IJwtToken
  }
}
