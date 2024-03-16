import configs from '../../utils/configs'
import express from 'express'
import type { RequestHandler, Router } from 'express'
import Controller from './controller'
import asyncErrorCatcher from '../../utils/asyncErrorCatcher'
import multer from 'multer'

const controller: Controller = new Controller()
const router: Router = express.Router()
const multerMiddleware: RequestHandler = multer({ storage: multer.memoryStorage() }).array('files', configs.multer.limit_files)
router.post('/filesignature/scanner', [multerMiddleware], asyncErrorCatcher(controller.scanFiles.bind(controller)))

export default router
