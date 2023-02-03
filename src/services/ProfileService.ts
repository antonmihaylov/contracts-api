import createError from 'http-errors'

import type { Profile, Job } from '../models'
import { ProfileType } from '../models'

import type { JobRepository } from './service-contracts/JobRepository'
import type { ProfileRepository } from './service-contracts/ProfileRepository'

export type ProfileDto = Readonly<
  Pick<Profile, 'id' | 'firstName' | 'lastName' | 'profession' | 'balance' | 'type'>
>

// Need to write unit tests for this

export class ProfileService {
  private static readonly MAX_PERCENTAGE_OF_JOBS_PRICE_TO_DEPOSIT = 25

  constructor(private readonly profiles: ProfileRepository, private readonly jobs: JobRepository) {}

  async getById(id: number): Promise<ProfileDto | null> {
    return await this.profiles.getById(id)
  }

  async depositBalance(clientId: number, amount: number): Promise<void> {
    const client = await this.profiles.getById(clientId)

    if (!client) {
      throw createError(404, 'Client not found')
    }

    const jobs = await this.jobs.getAllUnpaidActive(clientId)

    this.validateCanDeposit(client, jobs, amount)

    await this.profiles.updateBalance(clientId, client.balance! + amount)
  }

  private validateCanDeposit(client: Profile, jobs: ReadonlyArray<Job>, amount: number) {
    if (client.type !== ProfileType.Client) {
      throw createError(401, 'Only clients can deposit funds')
    }

    const totalJobPrice = jobs.reduce((total, job) => total + job.price, 0)
    const maxDeposit =
      totalJobPrice * (ProfileService.MAX_PERCENTAGE_OF_JOBS_PRICE_TO_DEPOSIT / 100)

    if (amount > maxDeposit) {
      throw createError(
        400,
        `Cannot deposit more than ${ProfileService.MAX_PERCENTAGE_OF_JOBS_PRICE_TO_DEPOSIT}% of total active job price`,
      )
    }

    if (amount <= 0) {
      throw createError(400, 'Cannot deposit a negative amount')
    }
  }
}
