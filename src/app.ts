import bodyParser from 'body-parser'
import express from 'express'
import 'express-async-errors'

import contractsRouter from './controllers/contracts'
import { sequelize } from './models/Sequelize'

const app = express()
app.use(bodyParser.json())

app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use('/', contractsRouter)

export default app
