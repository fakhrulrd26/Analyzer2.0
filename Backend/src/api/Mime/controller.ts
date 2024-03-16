import clients from '../../utils/clients'
import type { Request, Response } from 'express'
import type { Mime } from '@prisma/client'
import { extractPagination, type APIController } from '../general'
import { validateCommonDataSchema, validateDataUpdateSchema } from './utils/validator'
import type { CommonDataSchema, DataUpdateSchema } from './utils/validator'
import type { z } from 'zod'
import BadRequestError from '../../utils/errors/BadRequestError'
import NotFoundError from '../../utils/errors/NotFoundError'

export default class implements APIController {
  service: typeof clients.prisma.mime
  constructor () {
    this.service = clients.prisma.mime
  }

  async list (req: Request, res: Response): Promise<void> {
    const [pagination, page] = extractPagination(req.query)
    const mimes: Mime[] = await this.service.findMany({
      skip: page * pagination,
      take: pagination,
      orderBy: {
        name: req.query.sort_name === undefined ? 'asc' : 'desc'
      }
    })
    res.json({
      status: 'success',
      data: mimes
    })
  }

  async create (req: Request, res: Response): Promise<void> {
    const data: z.infer<typeof CommonDataSchema> = validateCommonDataSchema(req.body)
    const exists: Mime | null = await this.service.findUnique({ where: { name: data.name } })
    if (exists !== null) throw new BadRequestError(`Mime: ${data.name} telah ada di database.`)
    const mime: Mime = await this.service.create({ data })
    res.status(201).json({
      status: 'success',
      data: mime
    })
  }

  async findWhereId (req: Request, res: Response): Promise<void> {
    if (req.params.id === undefined) throw new NotFoundError('Id dari Mime harus dicantumkan di URL.')
    const id: number = +req.params.id
    try {
      const mime: Mime = await this.service.findUniqueOrThrow({ where: { id } })
      res.json({
        status: 'success',
        data: mime
      })
    } catch {
      throw new NotFoundError(`Mime dengan id: ${id} tidak ada di database`)
    }
  }

  async updateWhereId (req: Request, res: Response): Promise<void> {
    if (req.params.id === undefined) throw new NotFoundError('Id dari Mime harus dicantumkan di URL.')
    const id: number = +req.params.id
    const data: z.infer<typeof DataUpdateSchema> = validateDataUpdateSchema(req.body)
    try {
      await this.service.findUniqueOrThrow({ where: { id } })
      await this.service.update({ where: { id }, data })
      res.status(204).send()
    } catch {
      throw new NotFoundError(`Mime dengan id: ${id} tidak ada di database`)
    }
  }

  async deleteWhereId (req: Request, res: Response): Promise<void> {
    if (req.params.id === undefined) throw new NotFoundError('Id dari Mime harus dicantumkan di URL.')
    const id: number = +req.params.id
    try {
      await this.service.findUniqueOrThrow({ where: { id } })
      await this.service.delete({ where: { id } })
      res.status(204).send()
    } catch {
      throw new NotFoundError(`Mime dengan id: ${id} tidak ada di database`)
    }
  }
}
