import clients from '../../utils/clients'
import type { Request, Response } from 'express'
import type { Feedback, User } from '@prisma/client'
import { extractPagination, extractOrderParams, type APIController } from '../general'
import { validateCommonDataSchema, validateDataUpdateSchema } from './utils/validator'
import type { CommonDataSchema, DataUpdateSchema } from './utils/validator'
import type { z } from 'zod'
import AuthorizationError from '../../utils/errors/AuthorizationError'
import NotFoundError from '../../utils/errors/NotFoundError'
import type { Biner } from '../../utils/types'
import type { UserInterface } from '../User/utils/mapper'

export default class implements APIController {
  service: typeof clients.prisma.feedback
  constructor () {
    this.service = clients.prisma.feedback
  }

  async list (req: Request, res: Response): Promise<void> {
    const [pagination, page] = extractPagination(req.query)
    const orderParams = extractOrderParams(req.query)
    const orderBy: Record<string, Biner> = {}
    for (const q in orderParams) {
      if (q in ['o-createdAt', 'o-rate']) {
        const value: number = +orderParams[q]
        if ((value === 0) || (value === 1)) {
          orderBy[q.slice(2, -1)] = value
        }
      }
    }
    const feedbacks: Feedback[] = await this.service.findMany({
      skip: page * pagination,
      take: pagination,
      orderBy
    })
    res.json({
      status: 'success',
      data: feedbacks
    })
  }

  async create (req: Request & { user?: User }, res: Response): Promise<void> {
    const data: z.infer<typeof CommonDataSchema> = validateCommonDataSchema(req.body)
    const user: UserInterface | undefined = req.user
    console.log(user)
    if (user === undefined) throw new AuthorizationError('Anda tidak berhak mengirimkan feedback.')
    const Feedback: Feedback = await this.service.create({ data: { ...data, user_id: user.id } })
    res.status(201).json({
      status: 'success',
      data: Feedback
    })
  }

  async findWhereId (req: Request, res: Response): Promise<void> {
    if (req.params.id === undefined) throw new NotFoundError('Id dari Feedback harus dicantumkan di URL.')
    const id: number = +req.params.id
    try {
      const Feedback: Feedback = await this.service.findUniqueOrThrow({ where: { id } })
      res.json({
        status: 'success',
        data: Feedback
      })
    } catch {
      throw new NotFoundError(`Feedback dengan id: ${id} tidak ada di database`)
    }
  }

  async updateWhereId (req: Request, res: Response): Promise<void> {
    if (req.params.id === undefined) throw new NotFoundError('Id dari Feedback harus dicantumkan di URL.')
    const id: number = +req.params.id
    const data: z.infer<typeof DataUpdateSchema> = validateDataUpdateSchema(req.body)
    try {
      await this.service.findUniqueOrThrow({ where: { id } })
      await this.service.update({ where: { id }, data })
      res.status(204).send()
    } catch {
      throw new NotFoundError(`Feedback dengan id: ${id} tidak ada di database`)
    }
  }

  async deleteWhereId (req: Request, res: Response): Promise<void> {
    if (req.params.id === undefined) throw new NotFoundError('Id dari Feedback harus dicantumkan di URL.')
    const id: number = +req.params.id
    try {
      await this.service.findUniqueOrThrow({ where: { id } })
      await this.service.delete({ where: { id } })
      res.status(204).send()
    } catch {
      throw new NotFoundError(`Feedback dengan id: ${id} tidak ada di database`)
    }
  }
}
