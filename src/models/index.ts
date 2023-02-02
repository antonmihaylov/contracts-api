import type { Contract } from './Contract'
import type { Job } from './Job'
import type { Profile } from './Profile'

export interface Models {
  Contract: typeof Contract
  Job: typeof Job
  Profile: typeof Profile
}

// Preload all models in the models directory
export * from './Contract'
export * from './Job'
export * from './Profile'
