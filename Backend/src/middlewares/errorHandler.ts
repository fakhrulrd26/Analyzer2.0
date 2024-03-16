import configs from '../utils/configs'
import type { Request, Response, NextFunction } from 'express'
import BadRequestError from '../utils/errors/BadRequestError'
import { MulterError } from 'multer'

export default function (err: Error & { status?: number, body?: string } | BadRequestError, req: Request, res: Response, next: NextFunction): any {
  if (err instanceof BadRequestError) {
    return res.status(err.code).json({
      status: 'fail',
      ...err.toObject()
    })
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({
      status: 'fail',
      message: 'Data yang dikirimkan tidak dalam format JSON yang valid',
      details: [{
        body: err.body,
        message: 'Bukan format JSON yang valid'
      }]
    })
  }

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).send({
        status: 'fail',
        message: `Ada field/input yang tidak diperlukan dikirim ke server atau jumlah file melebihi maksimum: ${configs.multer.limit_files}.`,
        details: {
          field: err.field,
          message: 'Field ini tidak dibutuhkan atau melebihi batas maksimum file.'
        }
      })
    }
  }

  console.log(err)
  console.log(err.stack)

  return res.status(500).json({
    status: 'error',
    contact: configs.developer.email,
    message: 'Ada kesalahan yang tidak diantisipasi di server, please contact us.'
  })
}
