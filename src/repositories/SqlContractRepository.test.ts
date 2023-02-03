import type { Transaction } from 'sequelize'

import { Contract, Profile } from '../models'
import { sequelize } from '../models/Sequelize'

import { SqlContractRepository } from './SqlContractRepository'

describe('SqlContractRepository integration tests', () => {
  let contract1: Contract
  let clientProfile: Profile
  let clientProfile2: Profile
  let contractorProfile: Profile

  let transaction: Transaction
  let repository: SqlContractRepository

  beforeAll(async () => {
    transaction = await sequelize.transaction()

    clientProfile = await Profile.create(
      {
        type: 'client',
        balance: 0,
        firstName: 'John',
        lastName: 'Doe',
        profession: 'developer',
      },
      { transaction },
    )

    clientProfile2 = await Profile.create(
      {
        type: 'client',
        balance: 0,
        firstName: 'John',
        lastName: 'Doe',
        profession: 'developer',
      },
      { transaction },
    )

    contractorProfile = await Profile.create(
      {
        type: 'contractor',
        balance: 0,
        firstName: 'Jane',
        lastName: 'Doe',
        profession: 'developer',
      },
      { transaction },
    )

    contract1 = await Contract.create(
      {
        status: 'new',
        ClientId: clientProfile.id,
        ContractorId: contractorProfile.id,
        terms: 'terms',
      },
      { transaction },
    )

    await Contract.create(
      {
        status: 'terminated',
        ClientId: clientProfile.id,
        ContractorId: contractorProfile.id,
        terms: 'terms',
      },
      { transaction },
    )

    repository = new SqlContractRepository(Contract, transaction)
  })

  afterAll(async () => {
    await transaction.rollback()
    await sequelize.close()
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
