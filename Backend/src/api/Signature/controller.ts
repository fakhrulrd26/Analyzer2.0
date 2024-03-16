import clients from '../../utils/clients'
import type { Request, Response } from 'express'
import type { Signature } from '@prisma/client'
import { extractPagination, type APIController } from '../general'
import { validateCommonDataSchema, validateDataUpdateSchema } from './utils/validator'
import type { CommonDataSchema, DataUpdateSchema } from './utils/validator'
import type { z } from 'zod'
import NotFoundError from '../../utils/errors/NotFoundError'

export default class implements APIController {
  service: typeof clients.prisma.signature
  constructor () {
    this.service = clients.prisma.signature
  }

  async list (req: Request, res: Response): Promise<void> {
    const [pagination, page] = extractPagination(req.query)
    const signatures: Signature[] = await this.service.findMany({
      skip: page * pagination,
      take: pagination,
      orderBy: {
        offset: req.query.sort_offset === undefined ? 'asc' : 'desc'
      }
    })
    res.json({
      status: 'success',
      data: signatures
    })
  }

  async create (req: Request, res: Response): Promise<void> {
    const data: z.infer<typeof CommonDataSchema> = validateCommonDataSchema(req.body)
    const signature: Signature = await this.service.create({ data })
    res.status(201).json({
      status: 'success',
      data: signature
    })
  }

  async findWhereId (req: Request, res: Response): Promise<void> {
    if (req.params.id === undefined) throw new NotFoundError('Id dari Signature harus dicantumkan di URL.')
    const id: number = +req.params.id
    try {
      const signature: Signature = await this.service.findUniqueOrThrow({ where: { id } })
      res.json({
        status: 'success',
        data: signature
      })
    } catch {
      throw new NotFoundError(`Signature dengan id: ${id} tidak ada di database`)
    }
  }

  async updateWhereId (req: Request, res: Response): Promise<void> {
    if (req.params.id === undefined) throw new NotFoundError('Id dari Signature harus dicantumkan di URL.')
    const id: number = +req.params.id
    const data: z.infer<typeof DataUpdateSchema> = validateDataUpdateSchema(req.body)
    try {
      await this.service.findUniqueOrThrow({ where: { id } })
      await this.service.update({ where: { id }, data })
      res.status(204).send()
    } catch {
      throw new NotFoundError(`Signature dengan id: ${id} tidak ada di database`)
    }
  }

  async deleteWhereId (req: Request, res: Response): Promise<void> {
    if (req.params.id === undefined) throw new NotFoundError('Id dari Signature harus dicantumkan di URL.')
    const id: number = +req.params.id
    try {
      await this.service.findUniqueOrThrow({ where: { id } })
      await this.service.delete({ where: { id } })
      res.status(204).send()
    } catch {
      throw new NotFoundError(`Signature dengan id: ${id} tidak ada di database`)
    }
  }
}
