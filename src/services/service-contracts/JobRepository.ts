import type { Job } from '../../models'

export interface JobRepository {
  /**
   * Returns all unpaid and in-progress jobs for a user (either as a contractor or a client)
   * @param profileId
   */
  getAllUnpaidActive: (profileId: number) => Promise<ReadonlyArray<Job>>

  getById: (jobId: number) => Promise<Job | null>

  update: (job: Job) => Promise<Job>
}
