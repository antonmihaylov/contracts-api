import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from 'sequelize'
import { DataTypes, Model } from 'sequelize'

import type { Contract } from './Contract'
import { sequelize } from './Sequelize'

export class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>> {
  declare id: CreationOptional<number>

  declare description: string

  declare price: number

  declare paid?: CreationOptional<boolean> | null

  declare paymentDate?: CreationOptional<Date> | null

  declare ContractId: ForeignKey<Contract['id']>
}

Job.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, modelName: 'Job', indexes: [{ fields: ['paid'] }] },
)
