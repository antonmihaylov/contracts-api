import express from 'express'

const adminRouter = express.Router()

// Need to write functional tests for this

/**
 * @returns all unpaid and in-progress jobs for a user (either as a contractor or a client)
 */
adminRouter.get('/best-profession', async (req, res) => {
  const { profileService } = req
  const { start, end } = req.query as { start: string; end: string }

  const startDate = new Date(start)
  const endDate = new Date(end)

  const bestProfession = await profileService.getBestProfession(startDate, endDate)

  res.send({ profession: bestProfession })
})

/**
 * GET /admin/best-clients?start=<date>&end=<date>&limit=<integer> -
 * returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
 */

adminRouter.get('/best-clients', async (req, res) => {
  const { profileService } = req
  const { start, end, limit } = req.query as { start: string; end: string; limit?: string }

  const startDate = new Date(start)
  const endDate = new Date(end)
  const limitNumber = limit ? parseInt(limit, 10) : undefined

  const bestClients = await profileService.getBestClients(startDate, endDate, limitNumber)

  res.send(bestClients)
})

export default adminRouter
