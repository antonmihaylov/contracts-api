import express from 'express'

import { getProfile } from '../middleware/getProfile'

const balancesRouter = express.Router()

// Need to write functional tests for this

/**
 * @returns all unpaid and in-progress jobs for a user (either as a contractor or a client)
 */
balancesRouter.get('/deposit/:userId', getProfile, async (req, res) => {
  const { profileService } = req
  const userId = parseInt(req.params.userId, 10)
  const { amount } = req.body as { amount: number }

  await profileService.depositBalance(userId, amount)

  res.send()
})

export default balancesRouter
