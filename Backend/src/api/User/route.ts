/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import type { Router } from 'express'
import Controller from './controller'
import asyncErrorCatcher from '../../utils/asyncErrorCatcher'
import authenticationHandler from '../../middlewares/authenticationHandler'

const router: Router = express.Router()
const controller: Controller = new Controller()

router.post('/users/register', asyncErrorCatcher(controller.register.bind(controller)))
router.post('/users/login', asyncErrorCatcher(controller.login.bind(controller)))
router.get('/users/:username', asyncErrorCatcher(controller.findByUsername.bind(controller)))
router.post('/users/refresh-token', asyncErrorCatcher(controller.refreshToken.bind(controller)))
router.post('/users/logout', [authenticationHandler], asyncErrorCatcher(controller.logout.bind(controller)))
router.patch('/users/:username', [authenticationHandler], asyncErrorCatcher(controller.updateByUsername.bind(controller)))
router.delete('/users/:username', [authenticationHandler], asyncErrorCatcher(controller.deleteByUsername.bind(controller)))

export default router
