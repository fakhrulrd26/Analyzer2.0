import type { RefreshToken } from '@prisma/client'
import clients from '../../utils/clients'
import NotFoundError from '../../utils/errors/NotFoundError'

export default class {
  client: typeof clients.prisma.refreshToken
  constructor () {
    this.client = clients.prisma.refreshToken
  }

  async create (data: { user_id: number, token: string }): Promise<RefreshToken> {
    try {
      await this.findByUserId(data.user_id)
      await this.deleteByUserId(data.user_id)
    } catch {
      // user doesn't has a refresh token in the database
    }
    return await this.client.create({ data })
  }

  async findByToken (token: string): Promise<RefreshToken> {
    try {
      return await this.client.findFirstOrThrow({ where: { token } })
    } catch {
      throw new NotFoundError('Refresh token tidak ada di database')
    }
  }

  async deleteByToken (token: string): Promise<void> {
    await this.findByToken(token)
    await this.client.deleteMany({ where: { token } })
  }

  async findByUserId (userId: number): Promise<RefreshToken> {
    return await this.client.findUniqueOrThrow({ where: { user_id: userId } })
  }

  async deleteByUserId (userId: number): Promise<void> {
    await this.client.deleteMany({ where: { user_id: userId } })
  }
}
