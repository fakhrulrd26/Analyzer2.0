// import configs from '../../utils/configs'
import type { Request, Response } from 'express'
// import type { User } from '@prisma/client'
// import bcrypt from 'bcrypt'
// import type { z } from 'zod'
// import { validateDataRegister, validateDataLogin, validateDataUpdate, validateDataRefreshToken } from './utils/validator'
// import type { DataRegisterSchema, DataLoginSchema, DataUpdateSchema, DataRefreshTokenSchema } from './utils/validator'
// import AuthenticationError from '../../utils/errors/AuthenticationError'
// import { mapper } from './utils/mapper'
// import jwt from 'jsonwebtoken'
// import Service from './utils/service'
// import RefreshTokenService from '../RefreshToken/service'
// import BadRequestError from '../../utils/errors/BadRequestError'
// import type * as core from 'express-serve-static-core'
// import AuthorizationError from '../../utils/errors/AuthorizationError'
// import type { JwtPayload } from 'jsonwebtoken'
// import NotFoundError from '../../utils/errors/NotFoundError'

import clients from '../../utils/clients'

export default class {
  user: typeof clients.prisma.user

  constructor () {
    this.user = clients.prisma.user
  }

  async ringkasProgress (req: Request, res: Response): Promise<void> {
    const totalUser = await this.user.count()
    const totalCountry = (await this.user.findMany({ distinct: ['country_code'] })).length

    res.status(200).json({
      totalUser,
      totalCountry
    })
  }
}
