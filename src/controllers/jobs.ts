import express from 'express'

import { getProfile } from '../middleware/getProfile'

const jobsRouter = express.Router()

/**
 * @returns all unpaid and in-progress jobs for a user (either as a contractor or a client)
 */
jobsRouter.get('/unpaid', getProfile, async (req, res) => {
  const { jobService } = req

  const jobs = await jobService.getAllUnpaidJobs(req.profile!.id)

  res.json(jobs)
})

/**
 * @returns all non-terminated contracts for a user (either as a contractor or a client)
 */
jobsRouter.post('/:job_id/pay', getProfile, async (req, res) => {
  const { jobService } = req
  const jobId = parseInt(req.params.job_id, 10)

  await jobService.payJob(jobId, req.profile!.id)

  res.send()
})

export default jobsRouter
