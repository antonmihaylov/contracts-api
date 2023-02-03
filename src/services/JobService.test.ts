import type { ContractStatus } from '../models'
import { Contract, Job, Profile } from '../models'
import { InMemoryContractRepository } from '../repositories/InMemoryContractRepository'
import { InMemoryJobRepository } from '../repositories/InMemoryJobRepository'
import { InMemoryProfileRepository } from '../repositories/InMemoryProfileRepository'

import { JobService } from './JobService'
import { ProfileService } from './ProfileService'

let profileIdCounter = 0
const testClient = (balance: number) =>
  new Profile({
    type: 'client',
    balance,
    profession: 'profession',
    lastName: 'lastName',
    firstName: 'firstName',
    id: profileIdCounter++,
  })
const testContractor = (balance: number) =>
  new Profile({
    type: 'contractor',
    balance,
    profession: 'profession',
    lastName: 'lastName',
    firstName: 'firstName',
    id: profileIdCounter++,
  })

let contractIdCounter = 0
const testContract = (client: Profile, contractor: Profile, status: ContractStatus = 'new') =>
  new Contract({
    ClientId: client.id,
    ContractorId: contractor.id,
    id: contractIdCounter++,
    terms: 'terms',
    status,
  })

// Need to add more test cases
describe('Job Service', () => {
  it('should pay a job', async () => {
    const client = testClient(100)
    const contractor = testContractor(100)
    const contract = testContract(client, contractor)
    const job = new Job({
      id: 1,
      price: 100,
      paid: false,
      ContractId: contract.id,
      paymentDate: new Date(),
      description: 'description',
    })

    const jobRepository = new InMemoryJobRepository([job])
    const profileRepository = new InMemoryProfileRepository([client, contractor])
    const contractRepository = new InMemoryContractRepository([contract])
    const profileService = new ProfileService(profileRepository)

    const jobService = new JobService(
      jobRepository,
      contractRepository,
      profileRepository,
      profileService,
    )

    await jobService.payJob(job.id, client.id)

    expect(job.paid).toBe(true)
    expect(job.paymentDate).not.toBeUndefined()
    expect(client.balance).toBe(0)
    expect(contractor.balance).toBe(200)
  })

  it('should not pay a job if there are not enough funds', async () => {
    const client = testClient(100)
    const contractor = testContractor(100)
    const contract = testContract(client, contractor)
    const job = new Job({
      id: 1,
      price: 200,
      paid: false,
      ContractId: contract.id,
      paymentDate: new Date(),
      description: 'description',
    })

    const jobRepository = new InMemoryJobRepository([job])
    const profileRepository = new InMemoryProfileRepository([client, contractor])
    const contractRepository = new InMemoryContractRepository([contract])
    const profileService = new ProfileService(profileRepository)

    const jobService = new JobService(
      jobRepository,
      contractRepository,
      profileRepository,
      profileService,
    )

    await expect(jobService.payJob(job.id, client.id)).rejects.toThrow()
  })
})
