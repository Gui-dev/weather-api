import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
    const token = jwt.sign(payload, 'secretword', {
      expiresIn: '7d'
    })
    return token
  }
}
