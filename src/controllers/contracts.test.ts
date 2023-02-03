import supertest from 'supertest'

import { default as app } from '../app'
import { Contract, Job, Profile } from '../models'

describe('Contracts API', () => {
  let contract1: Contract
  let contractTerminated: Contract
  let clientProfile: Profile
  let clientProfile2: Profile
  let contractorProfile: Profile

  beforeAll(async () => {
    await Profile.sync({ force: true })
    await Contract.sync({ force: true })
    await Job.sync({ force: true })

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

    contractTerminated = await Contract.create({
      status: 'terminated',
      ClientId: clientProfile.id,
      ContractorId: contractorProfile.id,
      terms: 'terms',
    })
  })

  describe('GET /contracts', () => {
    it('should return 200 ok with all non-terminated user contracts for client', () =>
      supertest(app)
        .get('/contracts')
        .set('profile_id', clientProfile.id.toString())
        .expect(200)
        .then((response) =>
          expect(response.body).toEqual([
            expect.objectContaining({
              id: contract1.id,
              status: contract1.status,
              ClientId: contract1.ClientId,
              ContractorId: contract1.ContractorId,
              terms: contract1.terms,
            }),
          ]),
        ))

    it('should return 200 ok with all non-terminated user contracts for contractor', () =>
      supertest(app)
        .get('/contracts')
        .set('profile_id', contractorProfile.id.toString())
        .expect(200)
        .then((response) =>
          expect(response.body).toEqual([
            expect.objectContaining({
              id: contract1.id,
              status: contract1.status,
              ClientId: contract1.ClientId,
              ContractorId: contract1.ContractorId,
              terms: contract1.terms,
            }),
          ]),
        ))

    it('should return 200 ok with no contracts for another user', () =>
      supertest(app)
        .get('/contracts')
        .set('profile_id', clientProfile2.id.toString())
        .expect(200)
        .then((response) => expect(response.body).toEqual([])))

    it('should return 401 if not authenticated', () => supertest(app).get('/contracts').expect(401))
  })

  describe('GET /contracts/:id', () => {
    it('should get 200 with the contract details', () =>
      supertest(app)
        .get(`/contracts/${contract1.id}`)
        .set('profile_id', clientProfile.id.toString())
        .expect(200)
        .then((response) =>
          expect(response.body).toEqual({
            id: contract1.id,
            status: contract1.status,
            ClientId: contract1.ClientId,
            ContractorId: contract1.ContractorId,
            terms: contract1.terms,
            createdAt: expect.any(String) as unknown,
            updatedAt: expect.any(String) as unknown,
          }),
        ))

    it('should get 400 if the id is not valid', () =>
      supertest(app).get(`/contracts/blabla`).expect(400))

    it('should get 401 if not authenticated', () =>
      supertest(app).get(`/contracts/${contract1.id}`).expect(401))

    it('should get 403 if not authorized', () =>
      supertest(app)
        .get(`/contracts/${contractTerminated.id}`)
        .set('profile_id', clientProfile2.id.toString())
        .expect(403))

    it('should get 404 for a missing contract', () =>
      supertest(app)
        .get(`/contracts/999`)
        .set('profile_id', clientProfile.id.toString())
        .expect(404))
  })
})
