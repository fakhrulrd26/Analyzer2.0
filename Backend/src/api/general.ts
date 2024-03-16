import express from 'express'
import type { Request, Response, NextFunction, Router } from 'express'
import asyncErrorCatcher from '../utils/asyncErrorCatcher'
import type * as core from 'express-serve-static-core'
import authenticationHandler from '../middlewares/authenticationHandler'

export interface APIController {
  list: (req: Request<core.ParamsDictionary, any, any, core.Query & { pagination?: number, page?: number }>, res: Response, next: NextFunction) => Promise<void>
  create: (req: Request, res: Response, next: NextFunction) => Promise<void>
  findWhereId: (req: Request<core.ParamsDictionary & { id?: number }>, res: Response, next: NextFunction) => Promise<void>
  updateWhereId: (req: Request<core.ParamsDictionary & { id?: number }>, res: Response, next: NextFunction) => Promise<void>
  deleteWhereId: (req: Request<core.ParamsDictionary & { id?: number }>, res: Response, next: NextFunction) => Promise<void>
}

export function createAPIRoutes (prefix: string, controller: APIController): Router {
  const router: Router = express.Router()
  router.get(prefix, asyncErrorCatcher(controller.list.bind(controller)))
  router.post(prefix, [authenticationHandler], asyncErrorCatcher(controller.create.bind(controller)))
  router.get(prefix + '/:id', asyncErrorCatcher(controller.findWhereId.bind(controller)))
  router.patch(prefix + '/:id', [authenticationHandler], asyncErrorCatcher(controller.updateWhereId.bind(controller)))
  router.delete(prefix + '/:id', [authenticationHandler], asyncErrorCatcher(controller.deleteWhereId.bind(controller)))
  return router
}

export function extractPagination (query: core.Query): [number, number] {
  let a: number = query.pagination === undefined ? 10 : +query.pagination
  a = a < 1 ? 10 : Math.round(a)
  let b: number = query.page === undefined ? 1 : +query.page
  b = b < 0 ? 1 : Math.round(b)
  return [a, b]
}

export function extractOrderParams (query: core.Query): Record<string, string> {
  const result: Record<string, string> = {}
  for (const key in query) {
    if (key.slice(0, 2) === 'o-') {
      result[key] = query[key] as string
    }
  }
  return result
}
