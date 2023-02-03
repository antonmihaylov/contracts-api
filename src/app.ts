import bodyParser from 'body-parser'
import type { ErrorRequestHandler } from 'express'
import express from 'express'
import 'express-async-errors'
import * as OpenApiValidator from 'express-openapi-validator'

import contractsRouter from './controllers/contracts'
import { Contract } from './models'
import { sequelize } from './models/Sequelize'
import { ContractService } from './services/contract-service'

const app = express()
app.use(bodyParser.json())

app.set('sequelize', sequelize)
app.set('models', sequelize.models)
app.set('contractService', new ContractService(Contract))

app.use(
  OpenApiValidator.middleware({
    apiSpec: './openapi.yaml',
    validateRequests: true,
    validateResponses: false,
  }),
)

app.use('/contracts', contractsRouter)

app.use(((err: Error, req, res, next) => {
  console.error(err)

  // format error
  res.status('status' in err && typeof err.status === 'number' ? err.status : 500).json({
    message: err.message,
    errors: err.message,
    type: err.name,
  })
}) as ErrorRequestHandler)

export default app
