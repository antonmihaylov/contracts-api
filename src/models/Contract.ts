import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import { DataTypes, Model } from 'sequelize'

import { Job } from './Job'
import type { Profile } from './Profile'
import { sequelize } from './Sequelize'

export const ContractStatus = {
  New: 'new',
  InProgress: 'in_progress',
  Terminated: 'terminated',
} as const

export type ContractStatus = (typeof ContractStatus)[keyof typeof ContractStatus]

export class Contract extends Model<InferAttributes<Contract>, InferCreationAttributes<Contract>> {
  declare id: CreationOptional<number>

  declare terms: string

  declare status?: CreationOptional<ContractStatus> | null

  declare ContractorId: ForeignKey<Profile['id']>

  declare ClientId: ForeignKey<Profile['id']>
}

Contract.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ContractStatus)),
    },
  },
  {
    sequelize,
    modelName: 'Contract',
    indexes: [{ unique: false, fields: ['status'] }],
  },
)

Contract.hasMany(Job)
Job.belongsTo(Contract)
