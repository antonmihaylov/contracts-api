import { Contract, Profile } from '../models'
import { syncAll } from '../models/SyncAll'

import { SqlContractRepository } from './SqlContractRepository'

describe('SqlContractRepository integration tests', () => {
  let contract1: Contract
  let clientProfile: Profile
  let clientProfile2: Profile
  let contractorProfile: Profile

  let repository: SqlContractRepository

  beforeAll(async () => {
    await syncAll({ force: true })

    clientProfile = await Profile.create({
      type: 'client',
      balance: 0,
      firstName: 'John',
      lastName: 'Doe',
      profession: 'developer',
    })

    clientProfile2 = await Profile.create({
      type: 'client',
      balance: 0,
      firstName: 'John',
      lastName: 'Doe',
      profession: 'developer',
    })

    contractorProfile = await Profile.create({
      type: 'contractor',
      balance: 0,
      firstName: 'Jane',
      lastName: 'Doe',
      profession: 'developer',
    })

    contract1 = await Contract.create({
      status: 'new',
      ClientId: clientProfile.id,
      ContractorId: contractorProfile.id,
      terms: 'terms',
    })

    await Contract.create({
      status: 'terminated',
      ClientId: clientProfile.id,
      ContractorId: contractorProfile.id,
      terms: 'terms',
    })

    repository = new SqlContractRepository(Contract)
  })

  it('should get all non-terminated user contracts for a client', () =>
    repository.getAllNonTerminatedByUser(clientProfile.id).then((contracts) =>
      expect(contracts).toEqual([
        expect.objectContaining({
          id: contract1.id,
          status: contract1.status,
          ClientId: contract1.ClientId,
          ContractorId: contract1.ContractorId,
          terms: contract1.terms,
        }),
      ]),
    ))

  it('should not return unrelated contracts', () =>
    repository
      .getAllNonTerminatedByUser(clientProfile2.id)
      .then((contracts) => expect(contracts).toEqual([])))

  it('should get contract by id', () =>
    repository.getById(contract1.id).then((contract) =>
      expect(contract).toEqual(
        expect.objectContaining({
          id: contract1.id,
          status: contract1.status,
          ClientId: contract1.ClientId,
          ContractorId: contract1.ContractorId,
          terms: contract1.terms,
        }),
      ),
    ))
})
