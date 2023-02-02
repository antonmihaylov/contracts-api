import bodyParser from 'body-parser'
import express from 'express'

import { getProfile } from './middleware/getProfile'
import type { Models } from './models'
import { sequelize } from './models/Sequelize'

import 'express-async-errors'

const app = express()
app.use(bodyParser.json())

app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models') as Models
  const { id } = req.params
  const contract = await Contract.findOne({ where: { id } })
  if (!contract) return res.status(404).end()
  res.json(contract)
})

export default app
