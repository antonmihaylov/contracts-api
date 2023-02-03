import type { SyncOptions } from 'sequelize/types/sequelize'

import { Contract } from './Contract'
import { Job } from './Job'
import { Profile } from './Profile'

export async function syncAll(options?: SyncOptions) {
  await Profile.sync(options)
  await Contract.sync(options)
  await Job.sync(options)
}
