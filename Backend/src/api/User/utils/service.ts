import clients from '../../../utils/clients'
import type { User } from '@prisma/client'
import type { z } from 'zod'
import type { DataRegisterSchema, DataUpdateSchema } from './validator'
import BadRequestError from '../../../utils/errors/BadRequestError'
import NotFoundError from '../../../utils/errors/NotFoundError'

export default class {
  client: typeof clients.prisma.user
  constructor () {
    this.client = clients.prisma.user
  }

  async create (data: z.infer<typeof DataRegisterSchema>): Promise<User> {
    const { username, email }: { username: string, email: string } = data
    try {
      await this.findByUsername(username)
      throw new BadRequestError(`Username: ${username} telah dipakai oleh orang lain, coba username lain.`)
    } catch {
      try {
        await this.findByEmail(email)
        throw new BadRequestError(`Email: ${email} telah dipakai oleh orang lain, coba email lain.`)
      } catch {
        return await this.client.create({ data })
      }
    }
  }

  async findByUsername (username: string): Promise<User> {
    try {
      return await this.client.findFirstOrThrow({ where: { username } })
    } catch {
      throw new NotFoundError(`User dengan username: ${username} tidak ada.`)
    }
  }

  async findByEmail (email: string): Promise<User> {
    try {
      return await this.client.findFirstOrThrow({ where: { email } })
    } catch {
      throw new NotFoundError(`User dengan email: ${email} tidak ada.`)
    }
  }

  async updateByUsername (username: string, data: z.infer<typeof DataUpdateSchema>): Promise<User> {
    await this.findByUsername(username)
    return await this.client.update({ where: { username }, data })
  }

  async deleteByUsername (username: string): Promise<void> {
    await this.findByUsername(username)
    await this.client.delete({ where: { username } })
  }
}
