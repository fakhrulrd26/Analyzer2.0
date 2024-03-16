import BadRequestError from './BadRequestError'

export default class extends BadRequestError {
  constructor (message: string = 'Gagal otentikasi.', details: any = null) {
    super(message)
    this.name = 'AuthenticationError'
    this.code = 401
    this.details = details
  }
}
