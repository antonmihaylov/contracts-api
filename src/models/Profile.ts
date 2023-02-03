import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize'
import { DataTypes, Model } from 'sequelize'

import { Contract } from './Contract'
import { sequelize } from './Sequelize'

export const ProfileType = {
  Client: 'client',
  Contractor: 'contractor',
} as const
export type ProfileType = (typeof ProfileType)[keyof typeof ProfileType]

export class Profile extends Model<InferAttributes<Profile>, InferCreationAttributes<Profile>> {
  declare id: CreationOptional<number>

  declare firstName: string

  declare lastName: string

  declare profession: string

  declare balance?: CreationOptional<number> | null

  declare type?: CreationOptional<ProfileType | null>
}
Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ProfileType)),
    },
  },
  { sequelize, modelName: 'Profile' },
)

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' })
Contract.belongsTo(Profile, { as: 'Contractor' })

Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' })
Contract.belongsTo(Profile, { as: 'Client' })
