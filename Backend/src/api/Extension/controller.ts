import clients from '../../utils/clients'
import type { Request, Response } from 'express'
import type { Extension } from '@prisma/client'
import { extractPagination, type APIController } from '../general'
import { validateCommonDataSchema, validateDataUpdateSchema } from './utils/validator'
import type { CommonDataSchema, DataUpdateSchema } from './utils/validator'
import type { z } from 'zod'
import BadRequestError from '../../utils/errors/BadRequestError'
import NotFoundError from '../../utils/errors/NotFoundError'

export default class implements APIController {
  service: typeof clients.prisma.extension
  constructor () {
    this.service = clients.prisma.extension
  }

  async list (req: Request, res: Response): Promise<void> {
    const [pagination, page] = extractPagination(req.query)
    const extensions: Extension[] = await this.service.findMany({
      skip: page * pagination,
      take: pagination,
      orderBy: {
        name: req.query.sort_name === undefined ? 'asc' : 'desc'
      }
    })
    res.json({
      status: 'success',
      data: extensions
    })
  }

  async create (req: Request, res: Response): Promise<void> {
    const data: z.infer<typeof CommonDataSchema> = validateCommonDataSchema(req.body)
    const exists: Extension | null = await this.service.findUnique({ where: { name: data.name } })
    if (exists !== null) throw new BadRequestError(`Extension: ${data.name} telah ada di database.`)
    const extensions: Extension = await this.service.create({ data })
    res.status(201).json({
      status: 'success',
      data: extensions
    })
  }

  async findWhereId (req: Request, res: Response): Promise<void> {
    if (req.params.id === undefined) throw new NotFoundError('Id dari Extension harus dicantumkan di URL.')
    const id: number = +req.params.id
    try {
      const extensions: Extension = await this.service.findUniqueOrThrow({ where: { id } })
      res.json({
        status: 'success',
        data: extensions
      })
    } catch {
      throw new NotFoundError(`Extension dengan id: ${id} tidak ada di database`)
    }
  }

  async updateWhereId (req: Request, res: Response): Promise<void> {
    if (req.params.id === undefined) throw new NotFoundError('Id dari Extension harus dicantumkan di URL.')
    const id: number = +req.params.id
    const data: z.infer<typeof DataUpdateSchema> = validateDataUpdateSchema(req.body)
    try {
      await this.service.findUniqueOrThrow({ where: { id } })
      await this.service.update({ where: { id }, data })
      res.status(204).send()
    } catch {
      throw new NotFoundError(`Extension dengan id: ${id} tidak ada di database`)
    }
  }

  async deleteWhereId (req: Request, res: Response): Promise<void> {
    if (req.params.id === undefined) throw new NotFoundError('Id dari Extension harus dicantumkan di URL.')
    const id: number = +req.params.id
    try {
      await this.service.findUniqueOrThrow({ where: { id } })
      await this.service.delete({ where: { id } })
      res.status(204).send()
    } catch {
      throw new NotFoundError(`Extension dengan id: ${id} tidak ada di database`)
    }
  }
}
