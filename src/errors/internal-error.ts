export class InternalError extends Error {
  constructor(
    public readonly message: string,
    protected code: number = 500,
    protected description?: string
  ) {
    super()
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
