import bcrypt from 'bcrypt'

export class AuthService {
  public static async hashPassword (password: string, salt = 10): Promise<string> {
    const passwordHash = await bcrypt.hash(password, salt)
    return passwordHash
  }

  public static async comparePassword (password: string, passwordHashed: string): Promise<boolean> {
    const isValidPassword = await bcrypt.compare(password, passwordHashed)
    return isValidPassword
  }
}
