import configs from '../../utils/configs'
import type { Request, Response } from 'express'
import type { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import type { z } from 'zod'
import { validateDataRegister, validateDataLogin, validateDataUpdate, validateDataRefreshToken } from './utils/validator'
import type { DataRegisterSchema, DataLoginSchema, DataUpdateSchema, DataRefreshTokenSchema } from './utils/validator'
import AuthenticationError from '../../utils/errors/AuthenticationError'
import { mapper } from './utils/mapper'
import jwt from 'jsonwebtoken'
import Service from './utils/service'
import RefreshTokenService from '../RefreshToken/service'
import BadRequestError from '../../utils/errors/BadRequestError'
import type * as core from 'express-serve-static-core'
import AuthorizationError from '../../utils/errors/AuthorizationError'
import type { JwtPayload } from 'jsonwebtoken'
import NotFoundError from '../../utils/errors/NotFoundError'

export default class {
  service: Service
  refreshTokenService: RefreshTokenService
  constructor () {
    this.service = new Service()
    this.refreshTokenService = new RefreshTokenService()
  }

  async register (req: Request, res: Response): Promise<void> {
    const data: z.infer<typeof DataRegisterSchema> = validateDataRegister(req.body)
    data.password = await bcrypt.hash(data.password, configs.bcrypt.salt)
    const user: User = await this.service.create(data)
    res.status(201).json({
      status: 'success',
      data: mapper(user)
    })
  }

  async login (req: Request, res: Response): Promise<void> {
    const { username, password }: z.infer<typeof DataLoginSchema> = validateDataLogin(req.body)
    try {
      const user: User = await this.service.findByUsername(username)
      await bcrypt.compare(password, user.password)
      const accessToken = jwt.sign({ user: mapper(user) }, configs.jwt.access_secret as string, { expiresIn: configs.jwt.access_token_age })
      const refreshToken = jwt.sign({ user: mapper(user) }, configs.jwt.refresh_secret as string, { expiresIn: configs.jwt.refresh_token_age })
      await this.refreshTokenService.create({ user_id: user.id, token: refreshToken })
      res.json({
        status: 'success',
        data: { accessToken, refreshToken }
      })
    } catch {
      throw new AuthenticationError('Gagal login, username/password salah :(')
    }
  }

  async refreshToken (req: Request, res: Response): Promise<void> {
    const { refreshToken }: z.infer<typeof DataRefreshTokenSchema> = validateDataRefreshToken(req.body)
    try {
      await this.refreshTokenService.findByToken(refreshToken)
      try {
        const decoded: JwtPayload = jwt.verify(refreshToken, configs.jwt.refresh_secret as string) as JwtPayload
        const user: User = decoded.user
        const accessToken = jwt.sign({ user: mapper(user) }, configs.jwt.access_secret as string, { expiresIn: configs.jwt.access_token_age })
        res.json({
          status: 'success',
          data: { accessToken }
        })
      } catch {
        await this.refreshTokenService.deleteByToken(refreshToken)
        throw new AuthorizationError('Gagal refresh, refresh token tidak valid atau basi')
      }
    } catch {
      throw new AuthorizationError('Gagal refresh, refresh token tidak ada di database.')
    }
  }

  async logout (req: Request & { user?: User }, res: Response): Promise<void> {
    const user: User | undefined = req.user
    if (user === undefined) throw new AuthorizationError('Anda tidak berhak melakukan logout.')
    await this.refreshTokenService.deleteByUserId(user.id)
    res.status(204).send()
  }

  async findByUsername (req: Request<core.ParamsDictionary & { username?: string }>, res: Response): Promise<void> {
    const username: string | undefined = req.params.username
    if (username === undefined) throw new NotFoundError('Tolong cantumkan username pada path URL')
    const user: User = await this.service.findByUsername(username)
    res.json({
      status: 'success',
      data: mapper(user)
    })
  }

  async updateByUsername (req: Request<core.ParamsDictionary & { username?: string }> & { user?: User }, res: Response): Promise<void> {
    const username: string | undefined = req.params.username
    const user: User | undefined = req.user
    if (username === undefined) throw new NotFoundError('Tolong cantumkan username pada path URL.')
    if (user === undefined) throw new AuthorizationError('Anda tidak berhak melakukan update informasi.')
    const data: z.infer<typeof DataUpdateSchema> = validateDataUpdate(req.body)
    try {
      await this.service.updateByUsername(username, data)
      res.status(204).send()
    } catch (e) {
      throw new BadRequestError('Gagal memperbarui profile user')
    }
  }

  async deleteByUsername (req: Request<core.ParamsDictionary & { username?: string }> & { user?: User }, res: Response): Promise<void> {
    const username: string | undefined = req.params.username
    const user: User | undefined = req.user
    if (username === undefined) throw new NotFoundError('Tolong cantumkan username pada path URL.')
    if (user === undefined) throw new AuthorizationError('Anda tidak berhak menghapus informasi.')
    await this.service.deleteByUsername(username)
    res.status(204).send()
  }
}
