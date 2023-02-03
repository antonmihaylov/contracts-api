import type { Transaction } from 'sequelize'

import type { ContractService } from './services/ContractService'
import type { JobService } from './services/JobService'
import type { ProfileService, ProfileDto } from './services/ProfileService'

declare global {
  namespace Express {
    export interface Request {
      profile?: ProfileDto
      contractService: ContractService
      jobService: JobService
      profileService: ProfileService
      transaction?: Transaction
    }
  }
}
