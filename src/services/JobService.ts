import createError from 'http-errors'

import type { Job, Contract, Profile } from '../models'
import { ContractStatus } from '../models'

import type { ProfileService, ProfileDto } from './ProfileService'
import type { ContractRepository } from './service-contracts/ContractRepository'
import type { JobRepository } from './service-contracts/JobRepository'
import type { ProfileRepository } from './service-contracts/ProfileRepository'

export type JobDto = Readonly<
  Pick<Job, 'id' | 'description' | 'price' | 'paid' | 'paymentDate' | 'ContractId'>
>

export class JobService {
  constructor(
    private readonly jobs: JobRepository,
    private readonly contracts: ContractRepository,
    private readonly profiles: ProfileRepository,
    private readonly profileService: ProfileService,
  ) {}

  async getAllUnpaidJobs(profileId: number): Promise<ReadonlyArray<JobDto>> {
    return await this.jobs.getAllUnpaidActive(profileId)
  }

  async payJob(jobId: number, currentProfileId: number): Promise<void> {
    // Contracts and jobs could be combined in a single aggregate and repository
    // to avoid the need for multiple queries. But I assume payJob is not something that
    // happens often, so I'm not going to worry about it now.

    const job = await this.jobs.getById(jobId)

    if (!job) {
      throw createError(404, 'Job not found')
    }

    const contract = (await this.contracts.getById(job.ContractId))!
    const clientProfile = await this.profiles.getById(currentProfileId)

    if (!clientProfile) {
      throw createError(401, 'Client profile not found')
    }
    const contractorProfile = await this.profiles.getById(contract.ContractorId)

    if (!contractorProfile) {
      throw createError(401, 'Contractor profile not found')
    }

    this.authorizePayment(contract, currentProfileId)
    this.validateUserCanPay(contract, job, clientProfile)
    await this.transferFunds(clientProfile, contractorProfile, job.price)
    await this.markPaid(job, new Date())
  }

  private async transferFunds(
    fromProfile: ProfileDto,
    toProfile: ProfileDto,
    amount: number,
  ): Promise<void> {
    // This is in the same transaction, because of the transactionMiddleware
    await this.profiles.updateBalance(fromProfile.id, fromProfile.balance! - amount)
    await this.profiles.updateBalance(toProfile.id, (toProfile.balance ?? 0) + amount)
  }

  private validateUserCanPay(contract: Contract, job: Job, profile: Profile) {
    if (job.paid) {
      throw createError(400, 'Job already paid')
    }

    if (contract.status === ContractStatus.Terminated) {
      throw createError(400, 'Contract is terminated')
    }

    const jobIsNotFree = job.price > 0
    const userHasSufficientFunds = profile.balance && profile.balance >= job.price

    if (jobIsNotFree && !userHasSufficientFunds) {
      throw createError(400, 'Insufficient funds')
    }
  }

  private authorizePayment(contract: Contract, profileId: number) {
    if (contract.ClientId !== profileId) {
      throw createError(403, 'You are not authorized to pay this job')
    }
  }

  private async markPaid(job: Job, date: Date) {
    job.paymentDate = date
    job.paid = true
    await this.jobs.update(job)
  }
}
