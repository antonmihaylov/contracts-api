import type { Transaction } from 'sequelize'
import { Op } from 'sequelize'

import type { Contract } from '../models'
import { ContractStatus } from '../models'
import type { ContractRepository } from '../services/service-contracts/ContractRepository'

export class SqlContractRepository implements ContractRepository {
  constructor(
    private readonly contracts: typeof Contract,
    private readonly transaction?: Transaction,
  ) {}

  async getById(id: number): Promise<Contract | null> {
    return await this.contracts.findOne({ where: { id } })
  }

  async getAllNonTerminatedByUser(profileId: number): Promise<ReadonlyArray<Contract>> {
    return await this.contracts.findAll({
      where: {
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        status: { [Op.not]: ContractStatus.Terminated },
      },
      transaction: this.transaction,
    })
  }
}
