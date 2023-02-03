import type { Contract } from '../models'

import type { ProfileDto } from './ProfileService'
import type { ContractRepository } from './service-contracts/ContractRepository'

const isContractorOrClient = (contract: ContractDto, { id }: ProfileDto) =>
  contract.ContractorId === id || contract.ClientId === id

export type ContractDto = Readonly<
  Pick<Contract, 'id' | 'terms' | 'status' | 'ContractorId' | 'ClientId'>
>

export class ContractService {
  constructor(private readonly contracts: ContractRepository) {}

  async getById(id: number): Promise<ContractDto | null> {
    return await this.contracts.getById(id)
  }

  /**
   * Returns all non-terminated contracts for a user (either as a contractor or a client)
   * @param profileId
   */
  async getAllNonTerminatedByUser(profileId: number): Promise<ReadonlyArray<ContractDto>> {
    return await this.contracts.getAllNonTerminatedByUser(profileId)
  }

  async authorize(contract: ContractDto, profile: ProfileDto | undefined | null): Promise<boolean> {
    return !!profile && isContractorOrClient(contract, profile)
  }
}
