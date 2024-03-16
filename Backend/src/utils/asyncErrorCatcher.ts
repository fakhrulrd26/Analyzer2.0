import type { Request, Response, NextFunction } from 'express'

// nungggu express versi 5.x full release, karena versi 5.x gk butuh fungsi beginian :)

export default function (callback: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next)
    } catch (err: any) {
      next(err)
    }
  }
}
