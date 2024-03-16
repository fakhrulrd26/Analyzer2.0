import BadRequestError from './BadRequestError'

export default class extends BadRequestError {
  constructor (message: string = 'Resource tidak ditemukan.', details: any = null) {
    super(message)
    this.name = 'NotFoundError'
    this.code = 404
    this.details = details
  }
}
