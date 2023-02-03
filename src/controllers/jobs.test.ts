import type { Transaction } from 'sequelize'
import supertest from 'supertest'

import { Contract, Job, Profile } from '../models'
import { sequelize } from '../models/Sequelize'
import { createTestApp } from '../testApp'

// Need to improve those tests
describe('Jobs API tests', () => {
  let contractorProfile: Profile
  let app: ReturnType<typeof createTestApp>
  let transaction: Transaction

  beforeAll(async () => {
    transaction = await sequelize.transaction()
    app = createTestApp(transaction)

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
  })

  afterAll(() => transaction.rollback())

  describe('GET /jobs/unpaid', () => {
    it('should return 200 ok with a list of jobs', () =>
      supertest(app)
        .get('/jobs/unpaid')
        .set('profile_id', contractorProfile.id.toString())
        .expect(200)
        .then((response) => expect(response.body).toEqual([])))
  })

  describe('POST /jobs/:job_id/pay', () => {
    let clientProfile: Profile
    let job: Job
    let contract: Contract
    beforeAll(async () => {
      clientProfile = await Profile.create(
        {
          type: 'client',
          balance: 150,
          firstName: 'John',
          lastName: 'Doe',
          profession: 'developer',
        },
        { transaction },
      )

      contract = await Contract.create(
        {
          status: 'new',
          ClientId: clientProfile.id,
          ContractorId: contractorProfile.id,
          terms: 'terms',
        },
        { transaction },
      )

      job = await Job.create(
        {
          ContractId: contract.id,
          description: 'description',
          price: 100,
        },
        { transaction },
      )
    })

    it('should return 200 ok', () =>
      supertest(app)
        .post(`/jobs/${job.id}/pay`)
        .set('profile_id', clientProfile.id.toString())
        .expect(200))
  })
})
