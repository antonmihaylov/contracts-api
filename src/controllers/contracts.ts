import express from 'express'

import { getProfile } from '../middleware/getProfile'
import type { ContractService } from '../services/ContractService'

const contractsRouter = express.Router()

/**
 * @returns contract by id
 */
contractsRouter.get('/:id', getProfile, async (req, res) => {
  const contractService = req.app.get('contractService') as ContractService

  const id = parseInt(req.params.id, 10)
  const contract = await contractService.getById(id)

  if (!contract) {
    return res.status(404).end()
  }

  if (!(await contractService.authorize(contract, req.profile))) {
    return res.status(403).end()
  }

  res.json(contract)
})

/**
 * @returns all non-terminated contracts for a user (either as a contractor or a client)
 */
contractsRouter.get('/', getProfile, async (req, res) => {
  const contractService = req.app.get('contractService') as ContractService

  const contracts = await contractService.getAllNonTerminatedByUser(req.profile!.id)

  res.json(contracts)
})

export default contractsRouter
