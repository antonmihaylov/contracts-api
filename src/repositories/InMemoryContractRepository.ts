import type { Contract } from '../models'
import type { ContractRepository } from '../services/service-contracts/ContractRepository'

export class InMemoryContractRepository implements ContractRepository {
  private readonly contracts: Map<number, Contract>

  constructor(contracts: ReadonlyArray<Contract> = []) {
    this.contracts = new Map(contracts.map((contract) => [contract.id, contract]))
  }

  async getAllNonTerminatedByUser(profileId: number): Promise<ReadonlyArray<Contract>> {
    return [...this.contracts.values()].filter(
      (contract) =>
        contract.status !== 'terminated' &&
        (contract.ClientId === profileId || contract.ContractorId === profileId),
    )
  }

  async getById(id: number): Promise<Contract | null> {
    return this.contracts.get(id) ?? null
  }
}
