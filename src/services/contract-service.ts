import { Op } from 'sequelize'

import type { Contract } from '../models'
import { ContractStatus } from '../models'
import type { ProfileData } from '../types'

const isContractorOrClient = (contract: ContractDto, { id }: ProfileData) =>
  contract.ContractorId === id || contract.ClientId === id

export type ContractDto = Readonly<
  Pick<Contract, 'id' | 'terms' | 'status' | 'ContractorId' | 'ClientId'>
>

export class ContractService {
  constructor(private readonly contracts: typeof Contract) {}

  async getById(id: number): Promise<ContractDto | null> {
    return await this.contracts.findOne({ where: { id } })
  }

  /**
   * Returns all non-terminated contracts for a user (either as a contractor or a client)
   * @param userId
   */
  async getAllNonTerminatedByUser(userId: number): Promise<ReadonlyArray<ContractDto>> {
    return await this.contracts.findAll({
      where: {
        [Op.or]: [{ ContractorId: userId }, { ClientId: userId }],
        status: { [Op.not]: ContractStatus.Terminated },
      },
    })
  }

  async authorize(
    contract: ContractDto,
    profile: ProfileData | undefined | null,
  ): Promise<boolean> {
    return !!profile && isContractorOrClient(contract, profile)
  }
}
