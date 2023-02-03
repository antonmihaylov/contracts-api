import type { InferAttributes, Transaction } from 'sequelize'

import type { Profile } from './models'
import type { ContractService } from './services/ContractService'
import type { JobService } from './services/JobService'
import type { ProfileService } from './services/ProfileService'

export type ProfileData = Readonly<InferAttributes<Profile>>

declare global {
  namespace Express {
    export interface Request {
      profile?: ProfileData
      contractService: ContractService
      jobService: JobService
      profileService: ProfileService
      transaction?: Transaction
    }
  }
}
