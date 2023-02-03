import type { RequestHandler } from 'express'

import { Contract, Job, Profile } from '../models'
import { SqlContractRepository } from '../repositories/SqlContractRepository'
import { SqlJobRepository } from '../repositories/SqlJobRepository'
import { SqlProfileRepository } from '../repositories/SqlProfileRepository'
import { ContractService } from '../services/ContractService'
import { JobService } from '../services/JobService'
import { ProfileService } from '../services/ProfileService'

export const appServices: RequestHandler = async (req, res, next) => {
  const contractRepository = new SqlContractRepository(Contract, req.transaction)
  const jobRepository = new SqlJobRepository(Job, Contract, req.transaction)
  const profileRepository = new SqlProfileRepository(Profile, req.transaction)

  req.profileService = new ProfileService(profileRepository, jobRepository)
  req.contractService = new ContractService(contractRepository)
  req.jobService = new JobService(
    jobRepository,
    contractRepository,
    profileRepository,
    req.profileService,
  )

  next()
}
