import type { Profile } from '../../models'

import type { BestClientDto } from './BestClientDto'

export interface ProfileRepository {
  getById: (id: number) => Promise<Profile | null>

  updateBalance: (id: number, balance: number) => Promise<void>

  getBestProfession: (startRange: Date, endRange: Date) => Promise<string | null>
  getBestClients: (startRange: Date, endRange: Date, limit: number) => Promise<Array<BestClientDto>>
}
