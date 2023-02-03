import type { Contract } from '../../models'

export interface ContractRepository {
  getById: (id: number) => Promise<Contract | null>

  /**
   * Returns all non-terminated contracts for a user (either as a contractor or a client)
   * @param profileId
   */
  getAllNonTerminatedByUser: (profileId: number) => Promise<ReadonlyArray<Contract>>
}
