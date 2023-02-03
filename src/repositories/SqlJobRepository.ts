import type { Transaction } from 'sequelize'
import { Op } from 'sequelize'

import type { Job, Contract } from '../models'
import { ContractStatus } from '../models'
import type { JobRepository } from '../services/service-contracts/JobRepository'

export class SqlJobRepository implements JobRepository {
  constructor(
    private readonly jobModel: typeof Job,
    private readonly contractModel: typeof Contract,
    private readonly transaction?: Transaction,
  ) {}

  async getById(jobId: number): Promise<Job | null> {
    return await this.jobModel.findByPk(jobId, {
      transaction: this.transaction,
    })
  }

  async getAllUnpaidActive(profileId: number): Promise<ReadonlyArray<Job>> {
    return await this.jobModel.findAll({
      where: {
        paid: false,
      },
      include: [
        {
          model: this.contractModel,
          where: {
            [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
            status: ContractStatus.InProgress,
          },
          attributes: [],
          required: true,
        },
      ],
      transaction: this.transaction,
    })
  }

  async update(job: Job): Promise<Job> {
    return await job.save({
      transaction: this.transaction,
    })
  }
}
