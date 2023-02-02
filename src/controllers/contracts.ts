import express from 'express'

import app from '../app'
import { getProfile } from '../middleware/getProfile'
import type { Models } from '../models'

const contractsRouter = express.Router()

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

export default contractsRouter
