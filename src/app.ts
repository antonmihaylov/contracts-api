import bodyParser from 'body-parser'
import type { ErrorRequestHandler } from 'express'
import express from 'express'
import 'express-async-errors'
import * as OpenApiValidator from 'express-openapi-validator'
import httpErrors from 'http-errors'

import contractsRouter from './controllers/contracts'
import jobsRouter from './controllers/jobs'
import { transactionMiddleware } from './middleware/transactionMiddleware'
import { Contract, Job, Profile } from './models'
import { SqlContractRepository } from './repositories/SqlContractRepository'
import { SqlJobRepository } from './repositories/SqlJobRepository'
import { SqlProfileRepository } from './repositories/SqlProfileRepository'
import { ContractService } from './services/ContractService'
import { JobService } from './services/JobService'
import { ProfileService } from './services/ProfileService'

const app = express()
app.use(bodyParser.json())

app.use(transactionMiddleware)
app.use(async (req, res, next) => {
  const contractRepository = new SqlContractRepository(Contract, req.transaction)
  const jobRepository = new SqlJobRepository(Job, Contract, req.transaction)
  const profileRepository = new SqlProfileRepository(Profile, req.transaction)

  req.profileService = new ProfileService(profileRepository)
  req.contractService = new ContractService(contractRepository)
  req.jobService = new JobService(
    jobRepository,
    contractRepository,
    profileRepository,
    req.profileService,
  )

  next()
})

app.use(
  OpenApiValidator.middleware({
    apiSpec: './openapi.yaml',
    validateRequests: true,
    validateResponses: false,
  }),
)

app.use('/contracts', contractsRouter)
app.use('/jobs', jobsRouter)

app.use(((err: Error, req, res, next) => {
  console.error(err)

  if (httpErrors.isHttpError(err)) {
    res.status(err.status).json(
      err.expose
        ? {
            message: err.message,
            type: err.name,
          }
        : {
            message: 'Something went wrong',
          },
    )
  } else {
    const status = 'status' in err && typeof err.status === 'number' ? err.status : 500
    res.status(status).json({
      message: err.message,
      type: err.name,
    })
  }
}) as ErrorRequestHandler)

export default app
