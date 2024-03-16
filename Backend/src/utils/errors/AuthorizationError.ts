import BadRequestError from './BadRequestError'

export default class extends BadRequestError {
  constructor (message: string = 'Gagal otorisasi.', details: any = null) {
    super(message)
    this.name = 'AuthorizationError'
    this.code = 403
    this.details = details
  }
}
