import configs from './utils/configs'
import express from 'express'
import errorHandler from './middlewares/errorHandler'
import userRoute from './api/User/route'
import mimeRoute from './api/Mime/route'
import extensionRoute from './api/Extension/route'
import signatureRoute from './api/Signature/route'
import filescannerRoute from './api/FileScanner/route'
import feedbackRoute from './api/Feedback/route'
import basabasiRoute from './api/basabasi/route'
import countryRoute from './api/country/route'

import type { NextFunction, Request, Response } from 'express'
import cors from 'cors'

const app = express()
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Incoming request')
  next()
})
app.use(express.json())
app.get('/', (req: Request, res: Response) => res.send('Created by Mochy'))
//
app.use('/api', cors())
app.use('/api/v1', userRoute)
app.use('/api/v1', mimeRoute)
app.use('/api/v1', extensionRoute)
app.use('/api/v1', signatureRoute)
app.use('/api/v1', feedbackRoute)
app.use('/api/v1', basabasiRoute)
app.use('/api/v1', countryRoute)
app.use('/api/v1/services', filescannerRoute)
//
app.use(errorHandler)
app.listen(configs.server.port, () => { console.log(`Server berjalan pada port: ${configs.server.port}`) })
