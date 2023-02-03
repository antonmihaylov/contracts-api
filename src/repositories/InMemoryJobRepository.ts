import type { Job } from '../models'
import type { JobRepository } from '../services/service-contracts/JobRepository'

/**
 * Do not use in production, only for testing purposes
 */
export class InMemoryJobRepository implements JobRepository {
  private readonly jobs: Map<number, Job>

  constructor(jobs: ReadonlyArray<Job> = []) {
    this.jobs = new Map(jobs.map((job) => [job.id, job]))
  }

  async getAllUnpaidActive(profileId: number): Promise<ReadonlyArray<Job>> {
    // This doesn't work exactly, because we don't have the contract, but it's good enough for tests
    return [...this.jobs.values()]
  }

  async getById(jobId: number): Promise<Job | null> {
    return this.jobs.get(jobId) ?? null
  }

  async update(job: Job): Promise<Job> {
    this.jobs.set(job.id, job)
    return job
  }
}
