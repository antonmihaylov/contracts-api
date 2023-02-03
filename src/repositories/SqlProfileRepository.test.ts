import type { Transaction } from 'sequelize'

import { Contract, ContractStatus, Job, Profile } from '../models'
import { sequelize } from '../models/Sequelize'

import { SqlProfileRepository } from './SqlProfileRepository'

describe('SqlJobRepository integration tests', () => {
  let contractor1: Profile
  let contractor2: Profile
  let client1: Profile
  let client2: Profile

  let transaction: Transaction
  let repository: SqlProfileRepository

  beforeAll(async () => {
    transaction = await sequelize.transaction()

    repository = new SqlProfileRepository(Profile, Job, Contract, transaction)

    contractor1 = await Profile.create(
      {
        balance: 0,
        firstName: 'John',
        lastName: 'Doe',
        type: 'contractor',
        profession: 'Developer',
      },
      { transaction },
    )

    contractor2 = await Profile.create(
      {
        balance: 0,
        firstName: 'John',
        lastName: 'Doe',
        type: 'contractor',
        profession: 'Designer',
      },
      { transaction },
    )
    client1 = await Profile.create(
      {
        balance: 0,
        firstName: 'John',
        lastName: 'Doe',
        type: 'client',
        profession: 'Client',
      },
      { transaction },
    )
    client2 = await Profile.create(
      {
        balance: 0,
        firstName: 'Jane',
        lastName: 'Doe',
        type: 'client',
        profession: 'Client',
      },
      { transaction },
    )

    const contract1 = await Contract.create(
      {
        terms: 'terms',
        status: ContractStatus.InProgress,
        ContractorId: contractor1.id,
        ClientId: client1.id,
      },
      { transaction },
    )

    const contract2 = await Contract.create(
      {
        terms: 'terms',
        status: ContractStatus.InProgress,
        ContractorId: contractor1.id,
        ClientId: client2.id,
      },
      { transaction },
    )

    await Job.create(
      {
        description: 'job1',
        price: 100,
        ContractId: contract1.id,
        paid: true,
        paymentDate: new Date(),
      },
      { transaction },
    )
    await Job.create(
      {
        description: 'job2',
        price: 200,
        ContractId: contract2.id,
        paid: true,
        paymentDate: new Date(),
      },
      { transaction },
    )

    const contract3 = await Contract.create(
      {
        terms: 'terms',
        status: ContractStatus.InProgress,
        ContractorId: contractor2.id,
        ClientId: client2.id,
      },
      { transaction },
    )
    await Job.create(
      {
        description: 'job3',
        price: 100,
        ContractId: contract3.id,
        paid: true,
        paymentDate: new Date(),
      },
      { transaction },
    )
  })

  afterAll(async () => {
    await transaction.rollback()
    await sequelize.close()
  })

  it('should get best profession', async () => {
    const result = await repository.getBestProfession(new Date(Date.now() - 10000), new Date())
    expect(result).toEqual(contractor1.profession)
  })

  it('should get best clients', async () => {
    const result = await repository.getBestClients(new Date(Date.now() - 10000), new Date(), 2)
    expect(result).toEqual([
      { id: client2.id, paid: 300, fullName: `${client2.firstName} ${client2.lastName}` },
      { id: client1.id, paid: 100, fullName: `${client1.firstName} ${client1.lastName}` },
    ])
  })
})
