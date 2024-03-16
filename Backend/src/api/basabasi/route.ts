/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import type { Router } from 'express'
import Controller from './controller'
import asyncErrorCatcher from '../../utils/asyncErrorCatcher'

const router: Router = express.Router()
const controller: Controller = new Controller()

router.get('/basabasi/ringkasan-progress', asyncErrorCatcher(controller.ringkasProgress.bind(controller)))

export default router
