import clients from '../../utils/clients'
import type { Request, Response } from 'express'
import type { Country } from '@prisma/client'
import { extractPagination, type APIController } from '../general'
import { validateCommonDataSchema, validateDataUpdateSchema } from './utils/validator'
import type { CommonDataSchema, DataUpdateSchema } from './utils/validator'
import type { z } from 'zod'
import BadRequestError from '../../utils/errors/BadRequestError'
import NotFoundError from '../../utils/errors/NotFoundError'
import type * as core from 'express-serve-static-core'

export default class implements APIController {
  service: typeof clients.prisma.country
  constructor () {
    this.service = clients.prisma.country
  }

  async list (req: Request, res: Response): Promise<void> {
    const [pagination, page] = extractPagination(req.query)
    const countries: Country[] = await this.service.findMany({
      skip: page * pagination,
      take: pagination,
      orderBy: {
        name: req.query.sort_name === undefined ? 'asc' : 'desc'
      }
    })
    res.json({
      status: 'success',
      data: countries
    })
  }

  async create (req: Request, res: Response): Promise<void> {
    const data: z.infer<typeof CommonDataSchema> = validateCommonDataSchema(req.body)
    const nameExist: Country | null = await this.service.findUnique({ where: { name: data.name } })
    if (nameExist !== null) throw new BadRequestError(`Country name: ${data.name} telah ada di database.`)
    const codeExist: Country | null = await this.service.findUnique({ where: { code: data.code } })
    if (codeExist !== null) throw new BadRequestError(`Country code: ${data.code} telah ada di database.`)
    const countries: Country = await this.service.create({ data })
    res.status(201).json({
      status: 'success',
      data: countries
    })
  }

  async findWhereId (req: Request<core.ParamsDictionary & { code?: string }>, res: Response): Promise<void> {
    if (req.params.code === undefined) throw new NotFoundError('Code dari Country harus dicantumkan di URL.')
    const code: string = req.params.code
    try {
      const countries: Country = await this.service.findUniqueOrThrow({ where: { code } })
      res.json({
        status: 'success',
        data: countries
      })
    } catch {
      throw new NotFoundError(`Country dengan code: ${code} tidak ada di database`)
    }
  }

  async updateWhereId (req: Request<core.ParamsDictionary & { code?: string }>, res: Response): Promise<void> {
    if (req.params.code === undefined) throw new NotFoundError('Id dari Country harus dicantumkan di URL.')
    const code: string = req.params.code
    const data: z.infer<typeof DataUpdateSchema> = validateDataUpdateSchema(req.body)
    try {
      await this.service.findUniqueOrThrow({ where: { code } })
    } catch {
      throw new NotFoundError(`Country dengan code: ${code} tidak ada di database`)
    }

    if (data.code !== undefined) {
      const codeExist: Country | null = await this.service.findUnique({ where: { code: data.code } })
      if (codeExist !== null) throw new BadRequestError(`Country code: ${data.code} telah ada di database.`)
    }
    if (data.name !== undefined) {
      const nameExist: Country | null = await this.service.findUnique({ where: { name: data.name } })
      if (nameExist !== null) throw new BadRequestError(`Country name: ${data.name} telah ada di database.`)
    }
    await this.service.update({ where: { code }, data })
    res.status(204).send()
  }

  async deleteWhereId (req: Request<core.ParamsDictionary & { code?: string }>, res: Response): Promise<void> {
    if (req.params.code === undefined) throw new NotFoundError('Id dari Country harus dicantumkan di URL.')
    const code: string = req.params.code
    try {
      await this.service.findUniqueOrThrow({ where: { code } })
      await this.service.delete({ where: { code } })
      res.status(204).send()
    } catch {
      throw new NotFoundError(`Country dengan code: ${code} tidak ada di database`)
    }
  }
}
