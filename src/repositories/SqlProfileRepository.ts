import type { Transaction } from 'sequelize'

import type { Profile } from '../models'
import type { ProfileRepository } from '../services/service-contracts/ProfileRepository'

// Should make an integration test for this
export class SqlProfileRepository implements ProfileRepository {
  constructor(
    private readonly profileModel: typeof Profile,
    private readonly transaction?: Transaction,
  ) {}

  async getById(id: number): Promise<Profile | null> {
    return await this.profileModel.findByPk(id, { transaction: this.transaction })
  }

  async updateBalance(id: number, balance: number): Promise<void> {
    await this.profileModel.update({ balance }, { where: { id }, transaction: this.transaction })
  }
}
