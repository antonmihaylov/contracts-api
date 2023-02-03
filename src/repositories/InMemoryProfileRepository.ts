import type { Profile } from '../models'
import type { BestClientDto } from '../services/service-contracts/BestClientDto'
import type { ProfileRepository } from '../services/service-contracts/ProfileRepository'

export class InMemoryProfileRepository implements ProfileRepository {
  private readonly profiles: Map<number, Profile>

  constructor(profiles: ReadonlyArray<Profile> = []) {
    this.profiles = new Map(profiles.map((profile) => [profile.id, profile]))
  }

  async getById(id: number): Promise<Profile | null> {
    return this.profiles.get(id) ?? null
  }

  async updateBalance(id: number, balance: number): Promise<void> {
    const profile = await this.getById(id)
    if (profile) {
      profile.balance = balance
      this.profiles.set(id, profile)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBestClients(startRange: Date, endRange: Date, limit: number): Promise<Array<BestClientDto>> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBestProfession(startRange: Date, endRange: Date): Promise<string | null> {
    throw new Error('Method not implemented.')
  }
}
