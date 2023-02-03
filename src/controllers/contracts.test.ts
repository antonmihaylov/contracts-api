import type { Transaction } from 'sequelize'
import supertest from 'supertest'

import { Contract, Profile } from '../models'
import { sequelize } from '../models/Sequelize'
import { createTestApp } from '../testApp'

describe('Contracts API', () => {
  let contract: Contract
  let clientProfile: Profile
  let clientProfile2: Profile
  let contractorProfile: Profile
  let app: ReturnType<typeof createTestApp>
  let transaction: Transaction

  beforeAll(async () => {
    transaction = await sequelize.transaction()
    app = createTestApp(transaction)

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

    contract = await Contract.create(
      {
        status: 'new',
        ClientId: clientProfile.id,
        ContractorId: contractorProfile.id,
        terms: 'terms',
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
  })

  afterAll(async () => {
    await transaction.rollback()
    await sequelize.close()
  })

  describe('GET /contracts', () => {
    it('should return 200 ok with a list of contracts', () =>
      supertest(app)
        .get('/contracts')
        .set('profile_id', clientProfile.id.toString())
        .expect(200)
        .then((response) =>
          expect(response.body).toEqual([
            expect.objectContaining({
              id: contract.id,
              status: contract.status,
              ClientId: contract.ClientId,
              ContractorId: contract.ContractorId,
              terms: contract.terms,
            }),
          ]),
        ))

    it('should return 401 if not authenticated', () => supertest(app).get('/contracts').expect(401))
  })

  describe('GET /contracts/:id', () => {
    it('should get 200 with the contract details', () =>
      supertest(app)
        .get(`/contracts/${contract.id}`)
        .set('profile_id', clientProfile.id.toString())
        .expect(200)
        .then((response) =>
          expect(response.body).toEqual({
            id: contract.id,
            status: contract.status,
            ClientId: contract.ClientId,
            ContractorId: contract.ContractorId,
            terms: contract.terms,
            createdAt: expect.any(String) as unknown,
            updatedAt: expect.any(String) as unknown,
          }),
        ))

    it('should get 400 if the id is not valid', () =>
      supertest(app)
        .get(`/contracts/blabla`)
        .set('profile_id', clientProfile2.id.toString())
        .expect(400))

    it('should get 401 if not authenticated', () =>
      supertest(app).get(`/contracts/${contract.id}`).expect(401))

    it('should get 403 if not authorized', () =>
      supertest(app)
        .get(`/contracts/${contract.id}`)
        .set('profile_id', clientProfile2.id.toString())
        .expect(403))

    it('should get 404 for a missing contract', () =>
      supertest(app)
        .get(`/contracts/999`)
        .set('profile_id', clientProfile.id.toString())
        .expect(404))
  })
})
