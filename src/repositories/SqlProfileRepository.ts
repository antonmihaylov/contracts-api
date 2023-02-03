import type { Transaction } from 'sequelize'
import { Op, Sequelize } from 'sequelize'

import type { Profile, Job, Contract } from '../models'
import type { BestClientDto } from '../services/service-contracts/BestClientDto'
import type { ProfileRepository } from '../services/service-contracts/ProfileRepository'

// Should make an integration test for this
export class SqlProfileRepository implements ProfileRepository {
  constructor(
    private readonly profileModel: typeof Profile,
    private readonly jobModel: typeof Job,
    private readonly contractModel: typeof Contract,
    private readonly transaction?: Transaction,
  ) {}

  async getById(id: number): Promise<Profile | null> {
    return await this.profileModel.findByPk(id, { transaction: this.transaction })
  }

  async updateBalance(id: number, balance: number): Promise<void> {
    await this.profileModel.update({ balance }, { where: { id }, transaction: this.transaction })
  }

  async getBestProfession(startRange: Date, endRange: Date): Promise<string | null> {
    const data = await this.profileModel.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('Contractor.Jobs.price')), 'totalPrice'],
        'profession',
      ],
      group: ['profession'],
      order: [[Sequelize.col('totalPrice'), 'DESC']],
      limit: 1,
      subQuery: false,
      include: {
        model: this.contractModel,
        required: true,
        as: 'Contractor',
        attributes: [],
        include: [
          {
            model: this.jobModel,
            required: true,
            where: { paymentDate: { [Op.between]: [startRange, endRange] } },
            attributes: [],
          },
        ],
      },
    })

    return data.length > 0 ? data[0].profession : null
  }

  async getBestClients(
    startRange: Date,
    endRange: Date,
    limit: number,
  ): Promise<Array<BestClientDto>> {
    const data = await this.profileModel.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('Client.Jobs.price')), 'totalPrice'],
        'id',
        'firstName',
        'lastName',
      ],
      group: ['Profile.id'],
      order: [[Sequelize.col('totalPrice'), 'DESC']],
      limit,
      subQuery: false,
      include: {
        model: this.contractModel,
        required: true,
        as: 'Client',
        attributes: [],
        include: [
          {
            model: this.jobModel,
            required: true,
            where: { paymentDate: { [Op.between]: [startRange, endRange] } },
            attributes: [],
          },
        ],
      },
    })

    return data.map((client) => ({
      id: client.id,
      fullName: `${client.firstName} ${client.lastName}`,
      paid: client.get('totalPrice') as number,
    }))
  }
}
