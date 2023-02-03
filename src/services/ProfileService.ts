import type { Profile } from '../models'

import type { ProfileRepository } from './service-contracts/ProfileRepository'

export type ProfileDto = Readonly<
  Pick<Profile, 'id' | 'firstName' | 'lastName' | 'profession' | 'balance' | 'type'>
>

export class ProfileService {
  constructor(private readonly profiles: ProfileRepository) {}

  async getById(id: number): Promise<ProfileDto | null> {
    return await this.profiles.getById(id)
  }
}
