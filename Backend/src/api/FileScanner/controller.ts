import clients from '../../utils/clients'
import type { Request, Response } from 'express'
import { scanFiles } from './utils/functions'

export default class {
  mimeService: typeof clients.prisma.mime
  extensionService: typeof clients.prisma.extension
  signatureService: typeof clients.prisma.signature
  constructor () {
    this.mimeService = clients.prisma.mime
    this.extensionService = clients.prisma.extension
    this.signatureService = clients.prisma.signature
  }

  async scanFiles (req: Request, res: Response): Promise<void> {
    const files: Express.Multer.File[] = Array.isArray(req.files) ? req.files : []
    res.send({
      status: 'success',
      data: await scanFiles(files)
    })
  }
}
