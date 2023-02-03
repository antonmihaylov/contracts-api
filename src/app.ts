import bodyParser from 'body-parser'
import express from 'express'
import 'express-async-errors'

import balancesRouter from './controllers/balances'
import contractsRouter from './controllers/contracts'
import jobsRouter from './controllers/jobs'
import { appServices } from './middleware/appServices'
import { errorHandler } from './middleware/errorHandler'
import { openApiValidator } from './middleware/openApiValidator'
import { transactionMiddleware } from './middleware/transactionMiddleware'

const app = express()
app.use(bodyParser.json())

app.use(transactionMiddleware)
app.use(appServices)

app.use(openApiValidator)

app.use('/contracts', contractsRouter)
app.use('/jobs', jobsRouter)
app.use('/balances', balancesRouter)

app.use(errorHandler)

export default app
