export default class extends Error {
  code: number
  details: any
  constructor (message: string = 'Ada Error.', details: any = null) {
    super(message)
    this.name = 'BadRequestError'
    this.code = 400
    this.details = details
  }

  toObject (): { message: string, details: any } {
    return {
      message: this.message,
      details: this.details
    }
  }
}
