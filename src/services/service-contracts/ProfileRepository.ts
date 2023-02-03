import type { Profile } from '../../models'

export interface ProfileRepository {
  getById: (id: number) => Promise<Profile | null>

  updateBalance: (id: number, balance: number) => Promise<void>
}
