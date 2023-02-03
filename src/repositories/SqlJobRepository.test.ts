import type { Transaction } from 'sequelize'

import { Contract, ContractStatus, Job, Profile } from '../models'
import { sequelize } from '../models/Sequelize'

import { SqlJobRepository } from './SqlJobRepository'

describe('SqlJobRepository integration tests', () => {
  let activeContract: Contract
  let terminatedContract: Contract
  let newContract: Contract
  let contractor: Profile
  let client: Profile

  let transaction: Transaction
  let repository: SqlJobRepository

  beforeAll(async () => {
    transaction = await sequelize.transaction()
    repository = new SqlJobRepository(Job, Contract, transaction)

    client = await Profile.create(
      {
        balance: 0,
        firstName: 'John',
        lastName: 'Doe',
        type: 'client',
        profession: 'Banker',
      },
      { transaction },
    )

    contractor = await Profile.create(
      {
        balance: 0,
        firstName: 'John',
        lastName: 'Doe',
        type: 'contractor',
        profession: 'Developer',
      },
      { transaction },
    )

    activeContract = await Contract.create(
      {
        terms: 'terms',
        status: ContractStatus.InProgress,
        ContractorId: contractor.id,
        ClientId: client.id,
      },
      { transaction },
    )

    terminatedContract = await Contract.create(
      {
        terms: 'terms',
        status: ContractStatus.Terminated,
        ContractorId: contractor.id,
        ClientId: client.id,
      },
      { transaction },
    )

    newContract = await Contract.create(
      {
        terms: 'terms',
        status: ContractStatus.New,
        ContractorId: contractor.id,
        ClientId: client.id,
      },
      { transaction },
    )
  })

  afterAll(async () => {
    await transaction.rollback()
    await sequelize.close()
  })

  it('should get all unpaid jobs for active contracts', async () => {
    const activeJob = await Job.create(
      {
        description: 'job1',
        price: 100,
        ContractId: activeContract.id,
      },
      { transaction },
    )

    // A terminated contract should not be included
    await Job.create(
      {
        description: 'job2',
        price: 100,
        ContractId: terminatedContract.id,
      },
      { transaction },
    )

    // A new contract should not be included
    await Job.create(
      {
        description: 'job3',
        price: 100,
        ContractId: newContract.id,
      },
      { transaction },
    )

    const unpaidJobs = await repository.getAllUnpaidActive(contractor.id)

    expect(unpaidJobs).toEqual([
      expect.objectContaining({
        id: activeJob.id,
        description: activeJob.description,
        price: activeJob.price,
        paid: activeJob.paid,
      }),
    ])
  })

  it('should update a job and get a job by id', async () => {
    const job = await Job.create(
      {
        description: 'job1',
        price: 100,
        ContractId: activeContract.id,
      },
      { transaction },
    )

    job.paid = true

    await repository.update(job)

    const updatedJob = await repository.getById(job.id)

    expect(updatedJob?.paid).toEqual(job.paid)
  })
})
