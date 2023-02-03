import bodyParser from 'body-parser'
import type { RequestHandler } from 'express'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

import 'express-async-errors'

import adminRouter from './controllers/admin'
import balancesRouter from './controllers/balances'
import contractsRouter from './controllers/contracts'
import jobsRouter from './controllers/jobs'
import { appServices } from './middleware/appServices'
import { errorHandler } from './middleware/errorHandler'
import { openApiValidator } from './middleware/openApiValidator'
import { transactionMiddleware as defaultTransactionMiddleware } from './middleware/transactionMiddleware'
import { sequelize } from './models/Sequelize'

export interface MiddlewareImplementations {
  transactionMiddleware?: RequestHandler
}

export function createApp({
  transactionMiddleware = defaultTransactionMiddleware,
}: MiddlewareImplementations = {}) {
  const app = express()

  app.use(bodyParser.json())

  app.set('sequelize', sequelize)

  const openApiSpec = YAML.load('./openapi.yaml') as never
  app.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      swaggerOptions: {},
    }),
  )

  app.use(openApiValidator)

  app.use(transactionMiddleware)
  app.use(appServices)

  app.use('/contracts', contractsRouter)
  app.use('/jobs', jobsRouter)
  app.use('/balances', balancesRouter)
  app.use('/admin', adminRouter)

  app.use(errorHandler)

  return app
}
