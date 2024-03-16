import configs from '../utils/configs'
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import AuthenticationError from '../utils/errors/AuthenticationError'

interface RequestWithAuth extends Request {
  user?: UserInterface
}

interface UserInterface {
  name: string
  email: string
  username: string
}

export default function (req: RequestWithAuth, res: Response, next: NextFunction): any {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1] ?? null

  if (token == null) next(new AuthenticationError('Anda tidak memiliki kredensial.', [{ header: 'Authorization', message: 'Kosong melompong, tolong isi header "Authorization" dengan token yang valid.' }]))

  else {
    try {
      const decoded: JwtPayload = jwt.verify(token, configs.jwt.access_secret as string) as JwtPayload
      req.user = decoded.user
      next()
    } catch {
      next(new AuthenticationError('Kredensial anda tidak valid.', [{ header: 'Authorization', message: 'Token palsu atau basi.' }]))
    }
  }
}
